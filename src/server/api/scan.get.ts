import { google } from 'googleapis'

interface SenderInfo {
  name: string
  email: string
  count: number
  unsubscribeUrl: string | null
}

const MAX_MESSAGES = 10000
const BATCH_SIZE = 50

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')

  const res = event.node.res
  const send = (data: Record<string, unknown>) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    const config = useRuntimeConfig()
    const auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret)
    auth.setCredentials({ access_token: token })

    const gmail = google.gmail({ version: 'v1', auth })

    send({ type: 'progress', message: 'Connecting to Gmail...' })

    // Collect all message IDs (paginated)
    const messageIds: string[] = []
    let pageToken: string | undefined

    while (messageIds.length < MAX_MESSAGES) {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 500,
        pageToken
      })

      const messages = response.data.messages || []
      messageIds.push(...messages.filter((m) => m.id).map((m) => m.id!))
      pageToken = response.data.nextPageToken ?? undefined

      send({ type: 'progress', message: `Found ${messageIds.length} messages...` })

      if (!pageToken) break
    }

    send({ type: 'progress', message: `Scanning ${messageIds.length} messages for mailing lists...` })

    const senderMap = new Map<string, SenderInfo>()

    for (let i = 0; i < messageIds.length; i += BATCH_SIZE) {
      const batch = messageIds.slice(i, i + BATCH_SIZE)

      const results = await Promise.allSettled(
        batch.map((id) =>
          gmail.users.messages.get({
            userId: 'me',
            id,
            format: 'metadata',
            metadataHeaders: ['From', 'List-Unsubscribe']
          })
        )
      )

      for (const result of results) {
        if (result.status !== 'fulfilled') continue
        const headers = result.value.data.payload?.headers || []

        const fromHeader = headers.find((h) => h.name?.toLowerCase() === 'from')?.value || ''
        const unsubHeader = headers.find((h) => h.name?.toLowerCase() === 'list-unsubscribe')?.value || ''

        if (!unsubHeader) continue

        // Parse From: "Name <email>" or bare address
        const angleMatch = fromHeader.match(/<([^>]+)>/)
        const email = (angleMatch?.[1] ?? fromHeader).trim().toLowerCase()
        const nameMatch = fromHeader.match(/^"?([^"<]+?)"?\s*</)
        const name = nameMatch?.[1]?.trim() || email

        // Prefer HTTPS unsubscribe URL over mailto
        const urls = [...unsubHeader.matchAll(/<([^>]+)>/g)].map((m) => m[1])
        const unsubscribeUrl = urls.find((u) => u?.startsWith('http')) ?? urls[0] ?? null

        const existing = senderMap.get(email)
        if (existing) {
          existing.count++
          if (!existing.unsubscribeUrl && unsubscribeUrl) existing.unsubscribeUrl = unsubscribeUrl
        } else {
          senderMap.set(email, { name, email, count: 1, unsubscribeUrl })
        }
      }

      const processed = Math.min(i + BATCH_SIZE, messageIds.length)
      if (processed % 500 === 0 || processed === messageIds.length) {
        send({ type: 'progress', message: `Processed ${processed} / ${messageIds.length}...` })
      }
    }

    const results = Array.from(senderMap.values()).sort((a, b) => b.count - a.count)

    send({ type: 'complete', results, totalScanned: messageIds.length })
  } catch (err) {
    send({ type: 'error', message: err instanceof Error ? err.message : 'Scan failed' })
  }

  res.end()
})
