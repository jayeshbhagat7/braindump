# GTD Brain Dump

A lightweight, installable personal task manager built as a client-side React app. It supports fast task capture, project and label organization, scheduling, recurring tasks, goals, and optional Google Drive and Google Calendar integration.

**Live app:** https://jayeshbhagat7.github.io/braindump/  
**Privacy Policy:** https://jayeshbhagat7.github.io/braindump/privacy.html  
**Terms of Service:** https://jayeshbhagat7.github.io/braindump/terms.html

## Features

### Capture and organize
- **Quick Add** with natural-language parsing for dates, times, priorities, projects, sections, and labels. Examples:
  - `Call supplier tomorrow 3pm @Work #followup p1`
  - `Submit report next week`
  - `Check materials in 3 days`
- **Inbox** for quickly capturing unfiled tasks.
- **Today** for overdue, due-today, and upcoming tasks.
- **Upcoming** for dated tasks.
- **Projects** with nested sub-projects and project sections.
- **Labels** and built-in/custom filters.
- **Search** across tasks.
- **Favorites** for quick access to projects and labels.
- **Web of Thoughts** to explore connections between projects, labels, and tasks.
- **Goals** to group tasks by goal timeline.
- **Completed & Archive** to review finished or archived tasks.

### Task details and workflows
- Due date and optional time.
- Priority levels P1–P4.
- Labels, project, and section assignment.
- Separate deadline and duration fields.
- Recurring tasks: daily, weekly, monthly, or yearly.
- Task comments.
- Sub-tasks and task selection/bulk actions.
- Eisenhower Matrix classification.
- Sort by manual order, date, priority, or alphabetical order where available.
- A short **Undo** window for supported task actions.
- Inbox items that remain unfiled for more than seven days are automatically archived.
- JSON backup download and restore in Settings.

### Google integration (optional)
- **Google Drive:** stores a copy of app data in the Google Drive app-specific `appDataFolder` for sync and recovery.
- **Google Calendar:** creates related all-day calendar events for dated tasks and attempts to remove associated events when tasks are completed or deleted.
- A manual **Sync all** action is available in Settings. On mobile, pull down at the top of a list to trigger a sync.
- Google access can be disconnected in Settings or revoked from your Google Account.

### Installable and responsive
- Progressive Web App (PWA) manifest and service worker.
- Responsive layout with desktop sidebar and mobile bottom navigation.
- Service worker caching supports previously cached files when offline. Google sync requires a network connection.

## Deployment

This repository is configured for GitHub Pages:

**https://jayeshbhagat7.github.io/braindump/**

Keep the following files in the published repository root. Use these exact filenames (not dated filenames that may be used when downloading or sharing copies):

| File | Purpose |
|---|---|
| `index.html` | Main app and UI |
| `manifest.json` | PWA name, start URL, display mode, and icon declaration |
| `sw.js` | Service worker and offline cache |
| `styles.css` | File precached by the service worker; keep it present because the service worker includes it in its precache list |
| `icon.svg` | PWA app icon |
| `privacy.html` | Public privacy policy |
| `terms.html` | Public Terms of Service |
| `README.md` | Project documentation |

### Publish changes to GitHub Pages

1. Put the updated files in the repository root.
2. Commit and push the changes to the branch configured in **Settings → Pages** (commonly `main`).
3. Wait for GitHub Pages to finish deploying.
4. Open the live app and policy pages to verify they load:
   - https://jayeshbhagat7.github.io/braindump/
   - https://jayeshbhagat7.github.io/braindump/privacy.html
   - https://jayeshbhagat7.github.io/braindump/terms.html

For this repository, `manifest.json` starts the app at `./index.html`, and `index.html` registers `./sw.js`. Do not rename these files unless you also update the references in the app.

## Google Calendar and Drive setup

Google integration is optional. The app uses the Google Identity Services client library and requests these OAuth scopes:

- `https://www.googleapis.com/auth/calendar.events` — create/delete calendar events associated with dated tasks.
- `https://www.googleapis.com/auth/drive.appdata` — read/write app data in the app-specific Drive folder.

### 1. Configure Google Cloud

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project.
3. Under **APIs & Services → Library**, enable **Google Calendar API** and **Google Drive API**.
4. Under **Google Auth Platform**, configure the app's branding and audience/consent settings.
5. Create an OAuth 2.0 Client ID with application type **Web application**.
6. Add this exact origin under **Authorized JavaScript origins**:
   `https://jayeshbhagat7.github.io`

   For GitHub Pages, the origin is the host only; do not include `/braindump/` or a trailing path.
7. Configure the app's public domain and links:
   - App homepage: `https://jayeshbhagat7.github.io/braindump/`
   - Privacy Policy: `https://jayeshbhagat7.github.io/braindump/privacy.html`
   - Terms of Service: `https://jayeshbhagat7.github.io/braindump/terms.html`
8. If Google requires domain verification, follow the verification instructions shown in Google Auth Platform. OAuth testing/publishing requirements depend on the audience and requested scopes.

### 2. Connect Google in the app

1. Open the live app over HTTPS.
2. Open **Settings**.
3. Paste the OAuth Web Client ID (ending in `.apps.googleusercontent.com`) and save it.
4. Choose **Sign in with Google** and approve the requested Calendar and Drive access.
5. Confirm the connection status in Settings.

If Drive sync does not work, confirm that the Google Drive API is enabled and that the authorized JavaScript origin exactly matches `https://jayeshbhagat7.github.io`.

## How storage and sync work

- The app stores tasks and settings in the current browser's `localStorage`.
- Google Drive sync is optional; local use does not require a Google account.
- When connected, the app can read/write its data file in Drive's app-specific `appDataFolder`.
- The app includes timestamp-based sync logic and manual sync controls. It is **not** a real-time collaboration system, and simultaneous edits on different devices can overwrite one another.
- Google Calendar events are separate from task storage. Verify important appointments directly in Google Calendar.
- Export JSON backups regularly, especially before changing or clearing browser data, switching devices, or updating the app.
- Disconnecting or revoking Google access does not automatically guarantee deletion of existing data in Drive or Calendar.

## Known limitations

- No push notifications or guaranteed reminders. Tasks do not trigger a dependable background alert at a chosen time.
- No multi-user collaboration, task assignment, or shared-project workflow.
- Sync is not a conflict-free, field-by-field merge. Concurrent edits on different devices can result in one version replacing another.
- Browser storage can be cleared by the user, browser settings, or device maintenance. Drive sync and JSON export should not be treated as infallible backups.
- Calendar API/network/authentication failures may prevent an event from being created or deleted immediately.
- Monthly recurrence near the end of a month can behave unexpectedly for dates that do not exist in shorter months.
- Service worker caching does not make Google API calls or all third-party libraries available offline.

## Privacy and terms

The public policy pages are part of the published site:

- [Privacy Policy](https://jayeshbhagat7.github.io/braindump/privacy.html)
- [Terms of Service](https://jayeshbhagat7.github.io/braindump/terms.html)

Review these documents whenever app behavior or data handling changes. They should accurately describe the deployed build and actual practices.

## License

No license is specified in this README. Unless a license is added to the repository, do not assume that the code is offered under an open-source license.
