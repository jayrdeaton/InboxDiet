import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const code = query.code as string | undefined
  const oauthError = query.error as string | undefined
  if (oauthError) {
    return sendRedirect(event, '/?error=auth_denied')
  }

  const forwardedProto = getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim()
  const forwardedHost = getHeader(event, 'x-forwarded-host')?.split(',')[0]?.trim()
  const reqUrl = getRequestURL(event)
  const protocol = forwardedProto ?? reqUrl.protocol.replace(':', '')
  const host = forwardedHost ?? reqUrl.host
  const fallbackOrigin = `${protocol}://${host}`
  const appOrigin = (config.public.appUrl || fallbackOrigin).replace(/\/$/, '')
  const redirectUri = config.googleRedirectUri || `${appOrigin}/api/auth/callback`
  const isSecureRequest = protocol === 'https'

  if (!code) {
    return sendRedirect(event, '/?error=no_code')
  }

  const auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret, redirectUri)

  try {
    const { tokens } = await auth.getToken(code)

    if (!tokens.access_token) {
      return sendRedirect(event, '/?error=no_token')
    }

    setCookie(event, 'access_token', tokens.access_token, {
      httpOnly: true,
      secure: isSecureRequest,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60
    })

    try {
      auth.setCredentials(tokens)
      const oauth2 = google.oauth2({ version: 'v2', auth })
      const { data } = await oauth2.userinfo.get()

      if (data.email) {
        setCookie(event, 'user_email', data.email, {
          httpOnly: false,
          secure: isSecureRequest,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60
        })
      }
    } catch {
      // Email is only for display; do not fail auth if profile lookup fails.
    }

    return sendRedirect(event, '/')
  } catch {
    return sendRedirect(event, '/?error=auth_failed')
  }
})
