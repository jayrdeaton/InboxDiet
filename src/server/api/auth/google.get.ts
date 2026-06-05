import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const forwardedProto = getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim()
  const forwardedHost = getHeader(event, 'x-forwarded-host')?.split(',')[0]?.trim()
  const reqUrl = getRequestURL(event)
  const protocol = forwardedProto ?? reqUrl.protocol.replace(':', '')
  const host = forwardedHost ?? reqUrl.host
  const fallbackOrigin = `${protocol}://${host}`
  const appOrigin = (config.public.appUrl || fallbackOrigin).replace(/\/$/, '')
  const redirectUri = config.googleRedirectUri || `${appOrigin}/api/auth/callback`

  const auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, redirectUri)

  const url = auth.generateAuthUrl({
    access_type: 'online',
    scope: ['https://www.googleapis.com/auth/gmail.metadata', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent'
  })

  return sendRedirect(event, url)
})
