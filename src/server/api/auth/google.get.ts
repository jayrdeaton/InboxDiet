import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const reqUrl = getRequestURL(event)
  const origin = `${reqUrl.protocol}//${reqUrl.host}`

  const auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, `${origin}/api/auth/callback`)

  const url = auth.generateAuthUrl({
    access_type: 'online',
    scope: ['https://www.googleapis.com/auth/gmail.metadata', 'https://www.googleapis.com/auth/userinfo.email'],
    prompt: 'consent'
  })

  return sendRedirect(event, url)
})
