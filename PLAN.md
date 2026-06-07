# PLAN: Archive / Trash Messages from Scan Results

## Goal

Let users select one or more senders from the scan results and archive or trash all
matching messages directly from TrimBox — without leaving the page.

Users who only want reporting never see a write permission. The `gmail.modify` scope is
requested on-demand the first time a user tries to act on results (incremental authorization).

## Scope

- **Archive** — removes the `INBOX` label (messages move to All Mail, still searchable)
- **Trash** — moves messages to Trash (recoverable for 30 days)
- No permanent delete (too destructive for v1)

---

## OAuth strategy: incremental authorization

TrimBox uses two scopes across its lifetime:

| Scope | When granted | What it enables |
|---|---|---|
| `gmail.metadata` + `userinfo.email` | Initial sign-in (unchanged) | Scan / reporting |
| `gmail.modify` | First time user clicks Archive or Trash | Acting on results |

Users who only ever use the reporting feature are never shown the "modify your Gmail"
consent screen. The upgrade prompt appears in context — right when the user tries to act —
so the reason is obvious and trust is preserved.

**Google verification note:** The initial `gmail.metadata` review is unaffected. `gmail.modify`
can be submitted as a separate additive review after the feature ships. Confirm with Google
support whether it can be appended to the pending review or must be a fresh submission.

---

## Tasks

### 1. Incremental auth: upgrade endpoint

**File:** `src/server/api/auth/google.get.ts`

Read an optional `upgrade` query param. When present, include `gmail.modify` in the scope
array alongside the existing scopes. Pass `include_granted_scopes: true` so Google merges
the new grant with the existing token rather than replacing it.

```ts
const wantsUpgrade = getQuery(event).upgrade === 'true'
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.metadata',
  ...(wantsUpgrade ? ['https://www.googleapis.com/auth/gmail.modify'] : [])
]

const url = auth.generateAuthUrl({
  access_type: 'online',
  scope: scopes,
  include_granted_scopes: true,  // merge with previously granted scopes
  prompt: wantsUpgrade ? 'consent' : 'consent'  // always force consent so token reflects full scope set
})
```

No changes needed to the callback handler — it stores whatever token Google returns.

---

### 2. Collect message IDs per sender during scan

**File:** `src/server/api/scan.get.ts`

Add `messageIds: string[]` to `SenderAggregate` and `SenderInfo`. During the batch
metadata fetch loop, push each matched message's ID into the sender's `messageIds` array.
Include the full `messageIds` array in the SSE `complete` event payload.

The total IDs are bounded by `MAX_MESSAGES` (10,000) so payload size is acceptable (~150 KB worst case).

```ts
// SenderAggregate addition
messageIds: string[]

// SenderInfo addition
messageIds: string[]

// In the result loop after matching a sender:
existing.messageIds.push(result.value.data.id!)
// or on new sender:
messageIds: [messageId]

// In the final map:
messageIds: sender.messageIds
```

---

### 3. New action API endpoint

**New file:** `src/server/api/messages/action.post.ts`

Accepts a JSON body `{ action: 'archive' | 'trash', messageIds: string[] }`.

Uses `gmail.users.messages.batchModify` in batches of 1000 (API limit):
- **archive**: `removeLabelIds: ['INBOX']`
- **trash**: `addLabelIds: ['TRASH'], removeLabelIds: ['INBOX']`

Returns `{ success: true, count: number }` on success.
Returns `{ upgradeRequired: true }` with status 403 when the token lacks `gmail.modify` —
the frontend uses this to trigger the incremental auth flow rather than showing a generic error.

```ts
import { google } from 'googleapis'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'access_token')
  if (!token) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  const { action, messageIds } = body as { action: 'archive' | 'trash'; messageIds: string[] }

  if (!['archive', 'trash'].includes(action) || !Array.isArray(messageIds) || messageIds.length === 0) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  const config = useRuntimeConfig()
  const auth = new google.auth.OAuth2(config.googleClientId, config.googleClientSecret)
  auth.setCredentials({ access_token: token })
  const gmail = google.gmail({ version: 'v1', auth })

  const BATCH = 1000
  const labelMods =
    action === 'archive'
      ? { removeLabelIds: ['INBOX'] }
      : { addLabelIds: ['TRASH'], removeLabelIds: ['INBOX'] }

  try {
    for (let i = 0; i < messageIds.length; i += BATCH) {
      await gmail.users.messages.batchModify({
        userId: 'me',
        requestBody: { ids: messageIds.slice(i, i + BATCH), ...labelMods }
      })
    }
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status
    if (status === 403) {
      throw createError({ statusCode: 403, data: { upgradeRequired: true }, message: 'Insufficient scope' })
    }
    throw err
  }

  return { success: true, count: messageIds.length }
})
```

---

### 4. Frontend: selection state

**File:** `src/pages/index.vue`

Add to script setup:
```ts
const selectedSenders = ref<Set<string>>(new Set())  // keyed by sender.email

const toggleSender = (email: string) => {
  if (selectedSenders.value.has(email)) selectedSenders.value.delete(email)
  else selectedSenders.value.add(email)
}
const allSelected = computed(() => results.value.length > 0 && selectedSenders.value.size === results.value.length)
const toggleAll = () => {
  if (allSelected.value) selectedSenders.value.clear()
  else results.value.forEach((s) => selectedSenders.value.add(s.email))
}
const selectedMessageIds = computed(() =>
  results.value.filter((s) => selectedSenders.value.has(s.email)).flatMap((s) => s.messageIds)
)
const selectedCount = computed(() => selectedSenders.value.size)
```

Clear `selectedSenders` on `reset()` and when scan starts.

---

### 5. Frontend: checkbox column in results list

**File:** `src/pages/index.vue`

Update the list header grid to add a checkbox column:
```
grid-cols-[2rem_1fr_auto_minmax(8rem,18rem)]
```

List header gets a "select all" checkbox in the first cell.
Each sender row gets a checkbox in the first cell bound to `toggleSender(sender.email)`.

---

### 6. Frontend: action bar

**File:** `src/pages/index.vue`

Render a sticky action bar above the sender list when `selectedCount > 0`:

```html
<div v-if="selectedCount > 0" class="sticky top-4 z-10 mb-3 flex items-center justify-between gap-3 rounded-xl border border-orange-200 dark:border-orange-900 bg-white dark:bg-zinc-900 px-4 py-3 shadow-md">
  <span class="text-sm text-gray-600 dark:text-zinc-300">
    {{ selectedCount }} sender{{ selectedCount === 1 ? '' : 's' }} selected
    · {{ selectedMessageIds.length.toLocaleString() }} messages
  </span>
  <div class="flex gap-2">
    <button @click="confirmAction('archive')" ...>Archive all</button>
    <button @click="confirmAction('trash')" ...>Move to trash</button>
  </div>
</div>
```

---

### 7. Frontend: confirmation + execution

**File:** `src/pages/index.vue`

Add state:
```ts
const pendingAction = ref<'archive' | 'trash' | null>(null)
const actionStatus = ref<'idle' | 'running' | 'done' | 'error'>('idle')
const actionError = ref('')
```

`confirmAction(action)` sets `pendingAction`. Show an inline confirm panel (not a modal)
below the action bar:

```
Archive 312 messages from 4 senders? This removes them from your inbox.
[Confirm]  [Cancel]
```

On confirm, `executeAction()`:
1. Set `actionStatus = 'running'`
2. POST to `/api/messages/action` with `{ action, messageIds: selectedMessageIds.value }`
3. On **success**: remove acted-on senders from `results`, clear selection, show brief inline
   success note ("312 messages archived"), set `actionStatus = 'done'`
4. On **403 with `upgradeRequired`**: redirect to `/api/auth/google?upgrade=true` to trigger
   the incremental consent screen — after Google redirects back, the action can be retried
5. On **other error**: set `actionError`, show inline error with retry option

---

### 8. Update privacy copy

**File:** `src/pages/index.vue` (landing page privacy callout)

The sign-in callout still accurately says "Read-only access" because the initial grant
is still `gmail.metadata`. Update only the scope description paragraph to explain that
an optional additional permission may be requested if the user chooses to use the
archive/trash feature:

```diff
- Gmail permission used: Read-only access (gmail.metadata) to fetch message metadata and headers.
+ Gmail permission used: gmail.metadata (read-only) to scan your inbox. If you choose to
+   archive or trash messages, TrimBox will request gmail.modify at that time — you can
+   decline and continue using the reporting features without it.
```

**File:** `README.md` — update the Privacy section to describe the two-scope model.

---

## Implementation order

1. Task 2 (scan collects IDs) — unblocks all frontend work
2. Task 3 (action endpoint) — can be written in parallel with task 2
3. Task 1 (incremental auth handler) — needed to make the upgrade flow work end-to-end
4. Tasks 4–7 (frontend) — after 1–3
5. Task 8 (privacy copy) — last, once behavior is confirmed

## Edge cases

- **User declines `gmail.modify` on the upgrade screen**: Google redirects back normally
  but the token still lacks the scope. The next action attempt returns 403 → show a
  message explaining the permission is needed for archive/trash; reporting still works fine
- **Sender has 0 message IDs** (shouldn't happen but): disable action buttons for that row
- **Partial batch failure**: `batchModify` is all-or-nothing per batch call; surface the
  error and let the user retry — don't silently drop messages
- **Results change after action**: remove acted-on senders from the local `results` array
  immediately; no need to re-scan

## What this does NOT include

- Re-scan after acting (user can hit "Scan again" manually)
- Undo / restore (Gmail Trash is the undo; archive is recoverable via search)
- Permanent delete (`messages.delete`) — deferred intentionally
- Progress streaming for the action call (batches complete fast enough for a spinner)
