export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  const token = getCookie(event, 'access_token')
  const email = getCookie(event, 'user_email')

  return {
    signedIn: !!token,
    email: email || 'Connected Gmail account'
  }
})
