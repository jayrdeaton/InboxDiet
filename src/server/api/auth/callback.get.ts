import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const code = query.code as string | undefined
  const reqUrl = getRequestURL(event)
  const origin = `${reqUrl.protocol}//${reqUrl.host}`
  const isProd = process.env.NODE_ENV === 'production'

  if (!code) {
    return sendRedirect(event, '/?error=no_code')
  }

  const auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, `${origin}/api/auth/callback`)

  try {
    const { tokens } = await auth.getToken(code)

    if (!tokens.access_token) {
      return sendRedirect(event, '/?error=no_token')
    }

    auth.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: 'v2', auth })
    const { data } = await oauth2.userinfo.get()

    setCookie(event, 'access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60
    })

    if (data.email) {
      setCookie(event, 'user_email', data.email, {
        httpOnly: false,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60
      })
    }

    return sendRedirect(event, '/')
  } catch {
    return sendRedirect(event, '/?error=auth_failed')
  }
})
