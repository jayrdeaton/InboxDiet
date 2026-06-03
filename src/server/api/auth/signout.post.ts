export default defineEventHandler((event) => {
  const reqUrl = getRequestURL(event)
  const isSecureRequest = reqUrl.protocol === 'https:'

  deleteCookie(event, 'access_token', {
    secure: isSecureRequest,
    sameSite: 'lax',
    path: '/'
  })
  deleteCookie(event, 'user_email', {
    secure: isSecureRequest,
    sameSite: 'lax',
    path: '/'
  })
  return { success: true }
})
