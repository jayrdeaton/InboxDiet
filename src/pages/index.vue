<template>
  <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-14">
    <!-- Hero -->
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold tracking-tight mb-3">Find every mailing list in your inbox.</h1>
      <p class="text-gray-500 dark:text-zinc-400 text-lg leading-relaxed">Sign in with Google to scan your inbox and discover who's been sending you email.</p>
    </div>

    <!-- Landing: not signed in -->
    <div v-if="!isSignedIn && status === 'idle'">
      <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-none">
        <div v-if="authError" class="mb-5 text-sm text-red-500">{{ authErrorMessage }}</div>
        <a href="/api/auth/google" class="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#ffffff" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffffff" />
          </svg>
          Connect Gmail
        </a>
        <p class="mt-4 text-sm text-gray-400 dark:text-zinc-500">Read-only access. Your email content never leaves Google's servers.</p>
      </div>

      <!-- How it works -->
      <div class="mt-8 space-y-6">
        <h2 class="text-lg font-semibold text-center text-gray-700 dark:text-zinc-200">How TrimBox works</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm dark:shadow-none">
            <div class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1">Scans your inbox</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400">TrimBox reads the sender and header fields of up to 10,000 of your messages to identify mailing lists and bulk senders. Email body content is never read or stored.</p>
          </div>
          <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm dark:shadow-none">
            <div class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1">Surfaces every sender</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400">Results are grouped by sender domain or exact address and sorted by volume, so you can quickly see who's filling your inbox most.</p>
          </div>
          <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm dark:shadow-none">
            <div class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1">One-click unsubscribe links</h3>
            <p class="text-sm text-gray-500 dark:text-zinc-400">Unsubscribe links are extracted directly from email headers and displayed alongside each sender, so you can opt out without digging through your inbox.</p>
          </div>
        </div>

        <!-- Privacy callout -->
        <div class="bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-5 py-4 text-sm text-gray-500 dark:text-zinc-400 space-y-1">
          <p><span class="font-medium text-gray-700 dark:text-zinc-200">Gmail permission used:</span> Read-only access (<code class="text-xs bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded">https://www.googleapis.com/auth/gmail.metadata</code>) to fetch message metadata and headers.</p>
          <p><span class="font-medium text-gray-700 dark:text-zinc-200">What TrimBox stores:</span> Nothing. No email content, attachments, or personal data are stored on TrimBox servers. All processing happens in memory during the scan and is discarded when you close the tab.</p>
          <p>
            See our
            <NuxtLink to="/privacy" class="text-orange-500 hover:text-orange-400 underline underline-offset-2 transition-colors">Privacy Policy</NuxtLink>
            for full details.
          </p>
        </div>
      </div>
    </div>

    <!-- Signed in: ready to scan -->
    <div v-else-if="isSignedIn && status === 'idle'">
      <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Signed in as <span class="font-medium text-gray-700 dark:text-zinc-200">{{ userEmail }}</span>
          </div>
          <button class="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors" @click="signOut">Sign out</button>
        </div>
        <div class="mb-5 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 px-4 py-3 space-y-4">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-zinc-300 mb-2">Mailbox scope</p>
            <div class="flex flex-wrap gap-x-5 gap-y-2 mb-3">
              <label class="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 dark:text-zinc-300">
                <input v-model="scanOptions.mailboxMode" type="radio" value="inbox" class="w-4 h-4 accent-orange-500" />
                Inbox only
              </label>
              <label class="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 dark:text-zinc-300">
                <input v-model="scanOptions.mailboxMode" type="radio" value="inbox-and-archived" class="w-4 h-4 accent-orange-500" />
                Inbox + archived
              </label>
            </div>
            <div class="flex flex-wrap gap-x-5 gap-y-2">
              <label class="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 dark:text-zinc-300">
                <input v-model="scanOptions.includeSpam" type="checkbox" class="w-4 h-4 accent-orange-500" />
                Include spam
              </label>
              <label class="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 dark:text-zinc-300">
                <input v-model="scanOptions.includeTrash" type="checkbox" class="w-4 h-4 accent-orange-500" />
                Include trash
              </label>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block text-sm text-gray-600 dark:text-zinc-300">
              <span class="block font-medium mb-1.5">Mailbox filter</span>
              <select v-model="scanOptions.promotionsOnly" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option :value="false">All mail</option>
                <option :value="true">Promotions/newsletters only</option>
              </select>
            </label>

            <label class="block text-sm text-gray-600 dark:text-zinc-300">
              <span class="block font-medium mb-1.5">Minimum email count</span>
              <input v-model.number="scanOptions.minCount" type="number" min="1" max="9999" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500" />
            </label>

            <label class="block text-sm text-gray-600 dark:text-zinc-300">
              <span class="block font-medium mb-1.5">Group results by</span>
              <select v-model="scanOptions.groupBy" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option value="domain">Sender domain</option>
                <option value="exact">Exact sender address</option>
              </select>
            </label>

            <label class="block text-sm text-gray-600 dark:text-zinc-300">
              <span class="block font-medium mb-1.5">Sort results by</span>
              <select v-model="scanOptions.sortBy" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option value="count">Most emails</option>
                <option value="newest">Newest activity</option>
              </select>
            </label>

            <label class="block text-sm text-gray-600 dark:text-zinc-300">
              <span class="block font-medium mb-1.5">Unsubscribe links</span>
              <select v-model="scanOptions.linkMode" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option value="primary">Primary link only</option>
                <option value="all">All fallback links</option>
              </select>
            </label>

            <label class="block text-sm text-gray-600 dark:text-zinc-300">
              <span class="block font-medium mb-1.5">CSV export format</span>
              <select v-model="scanOptions.exportFormat" class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-orange-500">
                <option value="sender">One row per sender</option>
                <option value="link">One row per unsubscribe link</option>
              </select>
            </label>
          </div>
        </div>
        <button class="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg py-3 text-sm transition-colors" @click="startScan">Scan Inbox</button>
        <p class="mt-3 text-center text-xs text-gray-400 dark:text-zinc-500">Scans up to 10,000 messages across the selected mailbox areas.</p>
      </div>
    </div>

    <!-- Scanning: SSE progress -->
    <div v-else-if="status === 'scanning'">
      <div ref="progressContainer" class="bg-black border border-zinc-800 rounded-2xl p-5 font-mono text-sm leading-relaxed overflow-auto max-h-72">
        <p v-for="(msg, i) in progress" :key="i" class="text-orange-400"><span class="text-zinc-600 select-none">› </span>{{ msg }}</p>
        <span class="text-zinc-500 animate-pulse">▌</span>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="status === 'done'">
      <!-- Stats summary -->
      <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 mb-4 shadow-sm dark:shadow-none">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-3xl font-bold text-orange-500">{{ formatNumber(results.length) }}</p>
            <p class="text-gray-500 dark:text-zinc-400 text-sm mt-0.5">mailing lists found in {{ totalScanned.toLocaleString() }} messages</p>
          </div>
          <button class="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors flex-shrink-0" @click="downloadCsv">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mb-4">
        <button class="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors" @click="reset">← Scan again</button>
        <button class="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors" @click="signOut">Sign out &amp; clear</button>
      </div>

      <!-- Sender list -->
      <div v-if="results.length > 0" class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none mb-4">
        <!-- List header -->
        <div class="grid grid-cols-[1fr_auto_minmax(8rem,18rem)] gap-4 px-5 py-3 border-b border-gray-100 dark:border-zinc-800 text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
          <span>Sender</span>
          <span class="text-right">Emails</span>
          <span class="text-right">Unsubscribe links</span>
        </div>
        <!-- Rows -->
        <div v-for="(sender, i) in results" :key="sender.email" :class="i > 0 ? 'border-t border-gray-100 dark:border-zinc-800' : ''" class="grid grid-cols-[1fr_auto_minmax(8rem,18rem)] gap-4 px-5 py-3.5 items-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
          <div class="min-w-0">
            <p class="font-medium text-sm truncate">{{ sender.name }}</p>
            <p class="text-xs text-gray-400 dark:text-zinc-500 truncate">{{ sender.email }}</p>
          </div>
          <span class="text-sm font-semibold text-gray-600 dark:text-zinc-300 tabular-nums text-right">{{ formatNumber(sender.count) }}</span>
          <div class="text-right">
            <div v-if="getVisibleUnsubscribeUrls(sender).length > 0" class="flex flex-col items-end gap-1">
              <a v-for="(url, idx) in getVisibleUnsubscribeUrls(sender)" :key="`${sender.email}-${idx}`" :href="url" :title="url" target="_blank" rel="noopener noreferrer" class="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-medium transition-colors break-all"> {{ formatUnsubscribeLabel(url, idx) }} → </a>
            </div>
            <span v-else class="text-xs text-gray-300 dark:text-zinc-600">—</span>
          </div>
        </div>
      </div>

      <div v-else class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-none mb-4">
        <p class="text-gray-500 dark:text-zinc-400">No mailing lists found. Your inbox is already clean!</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="status === 'error'">
      <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <p class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
        <button class="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors" @click="reset">← Try again</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
interface SenderInfo {
  name: string
  email: string
  count: number
  latestSeen: number
  unsubscribeUrls: string[]
}

interface AuthStatus {
  signedIn: boolean
  email: string | null
}

interface ScanOptions {
  mailboxMode: 'inbox' | 'inbox-and-archived'
  includeSpam: boolean
  includeTrash: boolean
  promotionsOnly: boolean
  minCount: number
  groupBy: 'domain' | 'exact'
  linkMode: 'primary' | 'all'
  sortBy: 'count' | 'newest'
  exportFormat: 'sender' | 'link'
}

type Status = 'idle' | 'scanning' | 'done' | 'error'
const AUTO_SCROLL_THRESHOLD_PX = 24

const { data: initialAuth } = await useFetch<AuthStatus>('/api/auth/me', {
  key: 'auth-status-initial',
  headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined,
  default: () => ({ signedIn: false, email: null })
})

const status = ref<Status>('idle')
const isSignedIn = ref(initialAuth.value?.signedIn ?? false)
const userEmail = ref<string | null>(initialAuth.value?.email ?? null)
const scanOptions = ref<ScanOptions>({
  mailboxMode: 'inbox-and-archived',
  includeSpam: false,
  includeTrash: false,
  promotionsOnly: false,
  minCount: 1,
  groupBy: 'domain',
  linkMode: 'primary',
  sortBy: 'count',
  exportFormat: 'sender'
})
const progress = ref<string[]>([])
const progressContainer = ref<HTMLElement | null>(null)
const results = ref<SenderInfo[]>([])
const totalScanned = ref(0)
const errorMessage = ref('')

const route = useRoute()
const authError = computed(() => !!route.query.error)
const authErrorMessages: Record<string, string> = {
  no_code: 'Google sign-in was cancelled.',
  auth_denied: 'Google sign-in was denied or cancelled.',
  no_token: 'Failed to retrieve access token.',
  auth_failed: 'Authentication failed. Please try again.'
}
const authErrorMessage = computed(() => authErrorMessages[route.query.error as string] ?? 'Something went wrong. Please try again.')

onMounted(async () => {
  const fetchAuthStatus = async () => {
    const auth = await $fetch<{ signedIn: boolean; email: string | null }>(`/api/auth/me?t=${Date.now()}`, {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })

    isSignedIn.value = auth.signedIn
    userEmail.value = auth.email
    return auth.signedIn
  }

  try {
    const signedIn = await fetchAuthStatus()
    if (!signedIn) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      await fetchAuthStatus()
    }
  } catch {
    isSignedIn.value = false
    userEmail.value = null
  }
})

const signOut = async () => {
  await $fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
  isSignedIn.value = false
  userEmail.value = null
  status.value = 'idle'
  results.value = []
  progress.value = []
}

const reset = () => {
  status.value = 'idle'
  results.value = []
  progress.value = []
  errorMessage.value = ''
}

watch(
  () => progress.value.length,
  async () => {
    if (status.value !== 'scanning') return
    if (!progressContainer.value) return

    const distanceFromBottom = progressContainer.value.scrollHeight - progressContainer.value.scrollTop - progressContainer.value.clientHeight
    const shouldAutoScroll = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX

    await nextTick()
    if (!progressContainer.value || !shouldAutoScroll) return
    progressContainer.value.scrollTop = progressContainer.value.scrollHeight
  }
)

let eventSource: EventSource | null = null

const startScan = () => {
  status.value = 'scanning'
  progress.value = []
  results.value = []
  errorMessage.value = ''

  type ScanEvent = { type: 'progress'; message: string } | { type: 'complete'; results: SenderInfo[]; totalScanned: number } | { type: 'error'; message: string }

  const params = new URLSearchParams({
    includeArchived: String(scanOptions.value.mailboxMode === 'inbox-and-archived'),
    includeSpam: String(scanOptions.value.includeSpam),
    includeTrash: String(scanOptions.value.includeTrash),
    promotionsOnly: String(scanOptions.value.promotionsOnly),
    minCount: String(scanOptions.value.minCount),
    groupBy: scanOptions.value.groupBy,
    sortBy: scanOptions.value.sortBy
  })

  eventSource?.close()
  eventSource = new EventSource(`/api/scan?${params.toString()}`)

  eventSource.onmessage = (event) => {
    const msg = JSON.parse(event.data as string) as ScanEvent

    if (msg.type === 'progress') {
      progress.value.push(msg.message)
    } else if (msg.type === 'complete') {
      results.value = msg.results
      totalScanned.value = msg.totalScanned
      status.value = 'done'
      eventSource?.close()
    } else if (msg.type === 'error') {
      errorMessage.value = msg.message
      status.value = 'error'
      eventSource?.close()
    }
  }

  eventSource.onerror = () => {
    if (status.value === 'scanning') {
      errorMessage.value = 'Connection lost. Please try again.'
      status.value = 'error'
    }
    eventSource?.close()
  }
}

const getVisibleUnsubscribeUrls = (sender: SenderInfo): string[] => {
  return scanOptions.value.linkMode === 'all' ? sender.unsubscribeUrls : sender.unsubscribeUrls.slice(0, 1)
}

const formatNumber = (value: number): string => value.toLocaleString()

const downloadCsv = () => {
  const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
  const newestSeenLabel = 'Newest Seen (Unix ms)'

  const rows =
    scanOptions.value.exportFormat === 'link'
      ? results.value.flatMap((sender) => {
          const visibleUrls = getVisibleUnsubscribeUrls(sender)
          if (visibleUrls.length === 0) {
            return [[escapeCsv(sender.name), escapeCsv(sender.email), sender.count, escapeCsv(sender.latestSeen), '']]
          }

          return visibleUrls.map((url) => [escapeCsv(sender.name), escapeCsv(sender.email), sender.count, escapeCsv(sender.latestSeen), escapeCsv(url)])
        })
      : results.value.map((sender) => {
          const unsubscribeUrls = getVisibleUnsubscribeUrls(sender).join(' | ')
          return [escapeCsv(sender.name), escapeCsv(sender.email), sender.count, escapeCsv(sender.latestSeen), escapeCsv(unsubscribeUrls)]
        })

  const header = scanOptions.value.exportFormat === 'link' ? ['Sender Name', 'Email', 'Email Count', newestSeenLabel, 'Unsubscribe URL'] : ['Sender Name', 'Email', 'Email Count', newestSeenLabel, 'Unsubscribe URLs']
  const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'inbox-mailing-lists.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const formatUnsubscribeLabel = (url: string, index: number): string => {
  if (url.startsWith('mailto:')) return `Email ${index + 1}`

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    return hostname || `Link ${index + 1}`
  } catch {
    return `Link ${index + 1}`
  }
}

onUnmounted(() => {
  eventSource?.close()
})
</script>
