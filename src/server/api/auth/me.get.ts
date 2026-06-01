export default defineEventHandler((event) => {
  const token = getCookie(event, 'access_token')
  const email = getCookie(event, 'user_email')

  return {
    signedIn: !!token,
    email: email || null
  }
})
