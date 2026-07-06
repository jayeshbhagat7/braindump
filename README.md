# Brain Dump — Setup Guide

A single-file React + Google Drive/Calendar task app, built Todoist-style: braindump inbox, projects with sections (list or board view), sub-tasks, Quick Add with natural-language parsing, an Eisenhower Matrix, and a desktop sidebar layout alongside the mobile bottom nav.

## What's new in this build

This build folds in a large round of fixes and features since the last README update:

- **Sync overhaul.** Sync used to only pull from Drive once, on connect — two devices could drift apart until you manually pulled-to-refresh or reloaded. It now checks Drive automatically whenever you switch back to the app and every ~40 seconds while it's open. Merging is now done **task by task** (whichever device edited a *specific* task most recently wins for that task, not "whichever whole list is newer"), with deletion tombstones so a task deleted on one device doesn't quietly reappear from the other.
- **Google reconnects are lighter.** A lapsed session used to redisplay the entire first-time setup block. Now it's a single "🔐 Reconnect Google" tap — your Client ID stays remembered. The app also proactively refreshes your access token in the background before it expires, so you should hit the reconnect screen less often in the first place.
- **Sub-tasks are now real, independent tasks**, not a lightweight checklist trapped inside a parent. Any task can become a sub-task of any other:
  - Long-press to select a task, then use the **⇥ Indent** / **⇤ Outdent** buttons in the selection bar — the reliable way to do this.
  - Or drag a selected task onto another task's row to indent it there; drag it back onto its parent's row to outdent. A floating preview follows your finger and tells you what will happen before you let go.
  - Existing old-style sub-tasks were migrated automatically the first time you opened this build — nothing was lost.
- **Full-screen Date/Time picker**, matching Todoist's pattern: quick options (Tomorrow / Later this week / This weekend / Next week), an infinite-scrolling month calendar with task-count dots, an "Add time" step with a drag-or-tap analog clock, and Repeat — all with Save as a tick icon at the top, not a button buried at the bottom.
- **Task edit form is now pill-based.** Date, Priority, Project, Section, Labels, Deadline, Duration, Eisenhower quadrant, and Goal are compact pills — tap one to open its picker — instead of a long scroll of always-expanded chip grids.
- **Eisenhower Matrix is back**, reachable from the sidebar (desktop) or the profile menu (mobile): a proper 2×2 grid (Do First / Schedule / Delegate / Eliminate) with an "unsorted" list for anything you haven't quadrant-tagged yet.
- **Kanban board, fixed and extended.** Cards can be completed directly (a tick circle, same as list view), dragged between columns with auto-scroll near the board's edges, and each column has its own "+ Add task" that opens Quick Add pre-filled with that section. A same-column no-op bug (dropping a card back where it started could visually duplicate it) is fixed.
- **List/Board view choice is remembered per project**, including across a full app reload.
- **Undo.** Completing, archiving, deleting, or bulk-moving tasks shows a 5-second "UNDO" toast instead of being instantly final.
- **Pull-to-refresh** replaces the old manual "Retry Drive" / "Force sync" buttons — swipe down at the top of any list to sync.
- **Desktop gets a real sidebar** (Todoist-style: Search, Inbox, Today, Upcoming, Filters & Labels, Eisenhower Matrix, Favorites, My Projects tree), while the bottom tab bar stays for mobile. A CSS/viewport bug that hid the mobile bottom bar under Chrome's collapsing address bar, and briefly broke list scrolling entirely, is fixed.
- **Custom Filters** — build and save a project + label + priority combination as a named filter, sitting alongside Favorites.
- **Sort menu** (Manual / Date / Priority / A–Z, ascending or descending) on Inbox, Project, and Label views.
- **Upcoming** now has an expandable month grid with dot-indicators above the day-by-day agenda.
- **Deadline** (separate from due date), **Duration**, and **Comments** fields on tasks.
- **`*Heading` trick**: start a task's text with `*` and it displays as a bold, non-completable title row with no checkbox — handy for labeling a block of tasks without it being an actionable item itself.
- Calendar events for completed/deleted tasks that failed to delete (e.g. during a token hiccup) now retry automatically instead of lingering on your calendar forever.
- Fixed a broken service worker precache entry (`styles.css`, which doesn't exist in this build) that could silently prevent offline caching from installing at all.

## Feature list (current state)

- **Views:** Today, Inbox, Browse (Projects/Labels/Sections), Project (List or Board), Label, Search, Upcoming (week strip + month grid), Filters & Labels, Eisenhower Matrix, Goals, Web of Thoughts, Done/Archive, Settings.
- **Quick Add:** natural-language parsing (`tomorrow 3pm @Project /Section #label p1`) plus manual Date/Priority/Labels pills for when you'd rather tap than type.
- **Projects:** nested sub-projects, sections within a project, List/Board toggle (remembered per project), section-level ⋯ menu (add task / rename / duplicate / archive / delete), section reordering.
- **Tasks:** due date + time, deadline, duration, priority (with auto-escalation the longer an overdue task sits), labels, recurring (daily/weekly/monthly/yearly), comments, real nested sub-tasks, Eisenhower quadrant, goal timeline.
- **Bulk actions** (long-press to select): move up/down, indent/outdent, copy, label, move to project/section, archive, delete — each undoable.
- **Sync:** Google Drive (task storage, appDataFolder, survives a phone reset) + Google Calendar (auto-creates/removes all-day events as you assign/complete/delete dated tasks).
- **Offline-first:** works without Drive connected; local storage is the source of truth, Drive is a sync layer on top.
- **Responsive:** sidebar on desktop-width screens, bottom tab bar on mobile.

---

## Step 1: Install on Android (2 minutes)

### Easiest: Deploy free on Netlify
1. Go to **app.netlify.com/drop** on your PC or phone
2. Drag this entire folder and drop it on the page
3. You get a URL like `your-name.netlify.app` — copy it
4. Open that URL in **Chrome on Android**
5. Tap the Chrome menu **(⋮) → Add to Home screen → Add**
6. The app icon appears on your home screen like a real app ✅

### Alternative: GitHub Pages
1. Create a GitHub account and a new repository
2. Upload all 4 files (`index.html`, `manifest.json`, `sw.js`, `icon.svg`) to the repo
3. Go to Settings → Pages → Deploy from main branch
4. Your URL: `yourusername.github.io/repo-name`
5. Follow steps 4–6 above

---

## Step 2: Google Calendar Sync (10 minutes, optional)

Once the app is live on HTTPS, you can link it to Google Calendar and Drive (Drive stores your tasks so they survive a phone reset or sync across devices).

### 2a. Create Google Cloud credentials
1. Go to **console.cloud.google.com** and sign in
2. Click **Select a project → New Project** → name it anything → Create
3. Go to **APIs & Services → Library**
4. Search for **Google Calendar API** → click it → **Enable**
5. Also search for **Google Drive API** → click it → **Enable** (needed for task sync)
6. Go to **APIs & Services → Credentials**
7. Click **+ Create Credentials → OAuth 2.0 Client ID**
8. If prompted, configure the OAuth consent screen:
   - User type: **External** → Create
   - App name: anything (e.g. "My Brain Dump")
   - Add your email as support email → Save and Continue × 3
9. Back to Credentials → Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Under **Authorized JavaScript origins**, click **Add URI**
   - Paste your Netlify/GitHub URL (e.g. `https://your-name.netlify.app`)
   - Click **Create**
10. Copy the **Client ID** shown (ends in `.apps.googleusercontent.com`)

### 2b. Connect in the app
1. Open your app → tap **⚙️ Settings** (bottom nav, or sidebar on desktop)
2. Paste your Client ID in the field → **Save Client ID**
3. Tap **🔐 Sign in with Google**
4. Choose your Google account and allow Calendar + Drive access
5. Done! Settings now shows **✓ Connected**

This is genuinely a one-time setup. If your session later expires, you'll only see a single "Reconnect Google" button — not this whole flow again.

If you see "Signed in, but Drive isn't responding," it usually means the Drive API wasn't enabled in step 5 — reconnect after enabling it.

---

## How sync works

| Action | What happens |
|--------|-------------|
| Assign a date to a task | Auto-creates an all-day event in Google Calendar |
| Complete or delete a task | Its Calendar event is removed (retried automatically if the first attempt fails) |
| Date changed | Event recreated in Calendar |
| Sign in on a new device | App finds your stable Drive file (or recovers from an older version's file) and restores all tasks |
| Two devices edit independently | Each **task** is merged individually by whichever edit is newest — not a whole-list overwrite |
| A task is deleted on one device | A tombstone record propagates the deletion to your other devices instead of the task reappearing |
| Reopen the app / switch back to it | Syncs automatically — no manual step needed |
| Pull down at the top of a list | Manual sync, if you want to force it |

---

## Using the app

- **🏠 Today** — Overdue, due today, and the next 7 days
- **📥 Inbox** — Braindump anything, unfiled. Auto-archives after 7 days if not moved to a project
- **📁 Browse** — Projects (with sub-projects and sections), Labels, Favorites
- **📅 Upcoming** — Week strip + expandable month grid with task-count dots
- **🎛️ Filters & Labels** — Built-in smart filters, your saved custom filters, and all labels
- **🧭 Eisenhower Matrix** — Do First / Schedule / Delegate / Eliminate, set per-task from its Details pills
- **🕸️ Web of Thoughts** — Projects/labels as connection clusters; jump between related dumps via 🔗 chips
- **🌟 Goals** — Tasks tagged with a Goal Timeline
- **✅ Done** — Completed (undo available) and Archived (restore available)
- **⚙️ Settings** — Google sync, Projects, Labels, JSON Backup/Restore

**Quick Add** — type naturally, or tap the Date/Priority/Labels pills:
- `today`, `tomorrow`, `next week`, a weekday name, or `in 3 days`
- `p1`–`p4` for priority
- `@ProjectName` / `/SectionName` to file it
- `#label` — matching existing labels pop up to tap-complete

**Organizing tasks into sub-tasks:**
- Long-press a task to select it, then **⇥ Indent** (attaches under whichever task is above it) or **⇤ Outdent** (promotes one level up) from the action bar — the reliable option.
- Or drag the selected task onto another task's row; a floating preview shows what will happen before you drop.

**Priorities:** P1 (critical) → P2 (high) → P3 (medium) → P4 (low). Overdue tasks without a manual priority auto-escalate (⬆) the longer they sit.

**Recurring tasks:** Daily / Weekly / Monthly / Yearly — completing one auto-creates the next occurrence.

**`*Heading` trick:** start a task's text with `*` (e.g. `*Materials`) to turn it into a bold, non-completable title row — useful for labeling a group of tasks without it being an action item itself.

---

## Known gaps (not yet solved in this build)

Worth knowing about before relying on this for site-critical data:

1. **No field-by-field conflict merge.** If you edit the *exact same task* on two devices before either one syncs, whichever edit has the later timestamp wins for that task as a whole — there's no prompt to merge individual field changes.
2. **Kanban board doesn't show sub-task nesting.** Cards are flat per column; drag-indenting is a list-view feature only.
3. **A sub-task with its own due date may not always render nested under its parent** in Today/Upcoming if the parent doesn't independently match that same view's filter — it'll still show up, just not indented in place.
4. **Section reordering uses ▲▼ buttons, not a drag handle** — an intentional simplification alongside the card drag-and-drop, to avoid stacking two independent drag systems in one view.
5. **Recurring monthly tasks** from month-end dates (e.g. the 31st) may shift unexpectedly in shorter months — standard JS date-rollover behavior, not explicitly handled.
6. **No push notifications/reminders.** The Reminders concept from Todoist isn't built — there's no background mechanism to fire a notification at a given time yet.
7. **No vision board.** Mentioned early on, never fully specified, not built.
8. **Occasional Google re-prompts are still possible.** This app has no backend, so it can't hold a true long-lived refresh token — the background token refresh substantially reduces how often you'll see a reconnect prompt, but can't guarantee zero, especially if your browser restricts third-party cookies to accounts.google.com.

---

## Files in this package

```
index.html    — The full app (single-file React build)
manifest.json — Makes it installable as an Android PWA
sw.js         — Service worker (offline caching, cache version gtd-v7)
icon.svg      — App icon
README.md     — This file
```
