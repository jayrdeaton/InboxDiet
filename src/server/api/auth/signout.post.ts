export default defineEventHandler((event) => {
  deleteCookie(event, 'access_token')
  deleteCookie(event, 'user_email')
  return { success: true }
})
