# Brain Dump v6 — Setup Guide

This is the merged build: v5's architecture (stable Drive sync, Today/Browse/Search/Goals views, natural-language Quick Add) combined with v4's bulk multi-select, live `#tag` autocomplete, and the Web of Thoughts cluster view — plus one bug fix.

## What changed from v5 → v6
- **Fixed a bug**: the Scheduled tab's sub-task checkboxes called an undefined function (`toggleSubTask`) and would have crashed that screen — now wired correctly.
- **Bulk select restored** (from v4): tap **Select** in the top-right of Inbox or Scheduled to multi-select tasks, then Copy / bulk-Label / Archive / Delete from the action bar at the bottom.
- **Live `#tag` autocomplete restored** (from v4): while typing in Quick Add, typing `#` followed by a few letters shows matching existing labels as tappable suggestions, instead of only resolving tags after you finish typing.
- **🕸️ Web of Thoughts restored** (from v4, this had quietly disappeared in v5's redesign): a dedicated view under Browse → Web of Thoughts that shows every project and label as a "cluster" of related dumps. Tap a cluster to see all the thoughts tagged with it; each thought shows 🔗 chips for any other labels/project it also carries, so you can hop from one connected thought to the next — a lightweight Obsidian/Notion-style web of your labeled dumps, separate from the task edit form.
- Service worker cache bumped to `gtd-v6` so installed devices pick up the new files instead of serving stale cached ones.

## What v6 keeps from v5 (the stronger base)
- Stable Google Drive filename (`gtd_braindump.json`) with automatic recovery from older version files (`gtd_v5.json`, `gtd_v4.json`, etc.) — upgrading the app won't silently lose your data.
- Toast notification when your Google sign-in expires, so sync failures aren't silent.
- Natural-language Quick Add: type `check shuttering @C3 tomorrow p1 #urgent` and it auto-fills project, date, priority, and label.
- Today / Inbox / Browse / Project / Label / Search / Scheduled / Goals / Done / Settings / Web of Thoughts views.
- JSON Export/Import backup in Settings, independent of Google Drive.

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
2. Upload all 5 files to the repo
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
1. Open your app → tap **⚙️ Settings** (bottom nav "More")
2. Paste your Client ID in the field
3. Tap **Save Client ID**
4. Tap **🔐 Sign in with Google**
5. Choose your Google account and allow Calendar + Drive access
6. Done! Settings now shows **✓ Connected**

If you see "Signed in, but Drive isn't responding," it usually means the Drive API wasn't enabled in step 5, or your sign-in predates Drive access being requested — tap **Reconnect Google** to fix the latter.

---

## How sync works

| Action | What happens |
|--------|-------------|
| Assign a date to a task | Auto-creates an all-day event in Google Calendar |
| Complete a task | Calendar event is removed |
| Delete a task | Event deleted from Calendar |
| Date changed | Event recreated in Calendar |
| Sign in on a new device | App finds your stable Drive file (or recovers from an older version's file) and restores all tasks |
| Tap "Force sync Calendar" in Settings | Pushes all dated tasks that aren't in Calendar yet |
| Tap "Retry Drive connection" in Settings | Re-attempts the Drive handshake without a full re-login |

---

## Using the app

- **🏠 Today** — Overdue, due today, and the next 7 days, at a glance
- **📥 Inbox** — Tasks not yet assigned to a project. Tap **Select** to multi-select for bulk Copy / Label / Archive / Delete
- **📁 Browse** — Drill into Projects, Labels, Scheduled, Web of Thoughts, Goals, Completed
- **📅 Scheduled** — Every dated task grouped by Overdue / Today / Tomorrow / This Week / Later. Also supports **Select** for bulk actions
- **🕸️ Web of Thoughts** — Reachable via Browse. Shows projects and labels as connection clusters; tap one to see every thought tagged with it, then tap a 🔗 chip on any thought to jump to another cluster it's also connected to
- **🔍 Search** — Type 2+ characters to search across all tasks
- **🌟 Goals** — Tasks tagged with a Goal Timeline (Short/Medium/Long/Very Long-term)
- **✅ Done** — Completed tasks (undo available) and Archive (restore available)
- **⚙️ Settings** — Google sync, Projects, Labels, JSON Backup/Restore

**Quick Add (➕ button)** — type naturally:
- `today`, `tomorrow`, `next week`, `next month`, weekday names (`mon`, `tue`…), or `in 3 days`
- `p1`–`p4` or `!`/`!!`/`!!!` for priority
- `@ProjectName` to assign a project
- `#label` to tag — start typing `#` and matching existing labels pop up to tap-complete

**Bulk select** (Inbox & Scheduled) — tap **Select**, then tap tasks to multi-select:
- 📋 Copy — copies selected task text to clipboard
- 🏷️ Label — apply one or more labels to all selected at once
- 📦 — archive all selected
- 🗑️ — delete all selected (also removes their Calendar events)

**Web of Thoughts** — every project and every label that's currently in use on an active task becomes a tappable cluster card showing how many tasks are in it and how many are "cross-linked" (tagged with more than one label, or a label + a project). Tap into a cluster to see the actual thoughts, and tap any 🔗 chip on a thought to jump straight to another cluster it shares a tag with — useful for following a chain of related ideas (e.g. all dumps tagged `#steel` across both the `C3` and `DS-yard` projects) without manually searching.

**Priorities:** P1 (critical) → P2 (high) → P3 (medium) → P4 (low). Overdue tasks without a manual priority auto-escalate (shown with ⬆) the longer they sit.

**Recurring tasks:** Daily / Weekly / Monthly / Yearly — completing one auto-creates the next occurrence.

**Sub-tasks:** add inside a task's edit screen; tap to check off directly from the task list too.

---

## Known gaps (not yet solved in this build)

These were flagged when comparing the two source versions and are still open — worth knowing about before you rely on this for site-critical data:

1. **No conflict-resolution UI.** If you edit on two devices offline at the same time, the sync logic picks a "winner" automatically (by timestamp + task count) — there's no prompt to let you choose, so the loser's edits are silently dropped.
2. **No live/real-time sync.** Sync only happens on app load / reconnect, not continuously — two devices open at once won't see each other's changes until one reloads.
3. **No pending-sync indicator.** If a Drive/Calendar call fails silently (e.g., spotty site network), there's no on-screen "not yet synced" badge.
4. **Recurring monthly tasks** from month-end dates (e.g., the 31st) may shift unexpectedly in shorter months — standard JS date-rollover behavior, not explicitly handled.
5. **Subprojects (nested projects) and live `@project` autocomplete in Quick Add** were designed but not finished — not present in this build.
6. **No vision board** — was mentioned once but never fully specified; not built.

A reasonable next step if these matter to you: add a manual "Drive has newer data — keep local or use Drive?" prompt when both sides changed since last sync, and a small sync-status dot in the header.

---

## Files in this package

```
index.html    — The full app (merged v6 build, Web of Thoughts restored)
manifest.json — Makes it installable as an Android PWA
sw.js         — Service worker (offline caching, cache version gtd-v6)
icon.svg      — App icon
README.md     — This file
```

