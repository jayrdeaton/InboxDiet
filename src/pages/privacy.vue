<template>
  <main class="flex-1 max-w-3xl mx-auto w-full px-6 py-14">
    <div class="mb-8">
      <NuxtLink to="/" class="text-sm text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">← Back</NuxtLink>
    </div>

    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm dark:shadow-none prose prose-gray dark:prose-invert max-w-none">
      <h1 class="text-2xl font-bold tracking-tight mb-1">Privacy Policy</h1>
      <p class="text-sm text-gray-400 dark:text-zinc-500 mb-8">Last updated: June 3, 2025</p>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-3">What InboxDiet does</h2>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">InboxDiet connects to your Gmail account to scan your inbox for mailing list subscriptions. It reads email headers (sender addresses, subject lines, and List-Unsubscribe headers) to identify who has been sending you bulk email and surfaces unsubscribe links so you can opt out easily.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-3">Data we access</h2>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">InboxDiet requests read-only access to your Gmail account (<code class="text-xs bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">gmail.readonly</code> scope). We only read:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-zinc-400 text-sm space-y-1.5 ml-1">
          <li>Email headers (From, Subject, List-Unsubscribe)</li>
          <li>Your Gmail address (to display your signed-in account)</li>
        </ul>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed mt-3">We do not read email body content.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-3">Data we store</h2>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">We do not store any of your email data on our servers. All scanning happens in memory during your session and is discarded when you close the tab or sign out. We store a short-lived access token in an HTTP-only cookie solely to authenticate your scan request — it expires after one hour.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-3">Third-party services</h2>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">InboxDiet uses Google OAuth 2.0 for authentication and the Gmail API to read your inbox. Your data is subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="text-orange-600 dark:text-orange-400 hover:underline">Google's Privacy Policy</a>. We use Vercel to host this application; see <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener" class="text-orange-600 dark:text-orange-400 hover:underline">Vercel's Privacy Policy</a>.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-3">Revoking access</h2>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">You can revoke InboxDiet's access to your Gmail account at any time through <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" class="text-orange-600 dark:text-orange-400 hover:underline">Google Account Permissions</a>.</p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3">Contact</h2>
        <p class="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">Questions about this policy? Reach out at <a href="mailto:support@infinitetoken.com" class="text-orange-600 dark:text-orange-400 hover:underline">support@infinitetoken.com</a>.</p>
      </section>
    </div>
  </main>
</template>
