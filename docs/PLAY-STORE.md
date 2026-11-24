# VYUHA on Google Play — status and the steps left

17 November 2026 · Director. Updated 24 November (below, "24 Nov update"). Everything that can be done from the repository is done; the rest
needs the Commander's Google account, phone and twelve testers. Checked against Google's rules as
they stand in November 2026.

## Ready in the repository

| Item | Where | State |
|---|---|---|
| Android app (Capacitor 8) | `android/`, `capacitor.config.json` | package `com.medheng.vyuha`, targets **Android 16 (API 36)** — Google's rule for every new app since 31 Aug 2026; runs on Android 7 and up |
| What goes inside the app | `tools/build-www.mjs` → `www/` | only the game: `index.html`, `privacy.html`, `css/`, `js/`, `assets/` (~30 MB). No docs, tests, drafts |
| Builds the Play file | `.github/workflows/android.yml` | GitHub builds the **.aab** (for Play) and a **test .apk** (for your phone) on every app PR, or by hand from **Actions → Android build → Run workflow** |
| Full screen | `MainActivity.java` | status and navigation bars hidden; a swipe from the edge shows them for a moment |
| Phone's Back button | `js/native.js` | closes the open card → in battle opens Menu (never quits a battle) → elsewhere goes Home → on Home leaves the app |
| Silence in the background | `js/native.js`, `js/audio.js` | music and sound sleep when you switch app or lock the phone |
| WhatsApp share | `js/modes.js` | opens WhatsApp itself from the app |
| Offline | `css/fonts.css`, `assets/fonts/` | fonts bundled (they came from Google Fonts before); the app needs no internet at all |
| App icon | `android/app/src/main/res/mipmap-*` | the bronze wheel; adaptive icon (wheel on slate) for Android 8+ |
| Splash | `res/drawable*/splash.png`, `styles.xml` | cotton with the wheel (the Capacitor logo is gone) |
| Privacy policy | `privacy.html` → https://medh-eng.github.io/vyuha/privacy.html once merged | says plainly: nothing collected |
| Store pictures | `store/` (remake: `node tools/store-assets.mjs`) | 512 icon, 1024×500 feature graphic, 5 sideways + 5 upright phone screenshots |
| Store words | `incoming/text/store-listing.md` | draft of 29 Oct — **check it** (see "Words" below) |

## What only the Commander can do — in this order

1. **Merge the pull request.** The privacy page goes live with it.
2. **Make the upload key** (one time, keep it forever, never put it in git):
   install Android Studio → open the `android` folder → *Build → Generate Signed App Bundle* →
   *Create new…* key store. Note the file, both passwords and the alias.
   Or ask the Director in a chat to make one and send it to you privately.
3. **Give the key to GitHub** — repository → *Settings → Secrets and variables → Actions →
   New repository secret*, four times:
   `VYUHA_UPLOAD_KEYSTORE_B64` (the .jks file as base64 text), `VYUHA_UPLOAD_STORE_PASSWORD`,
   `VYUHA_UPLOAD_KEY_ALIAS`, `VYUHA_UPLOAD_KEY_PASSWORD`.
4. **Build:** *Actions → Android build → Run workflow.* When it finishes, download
   `vyuha-phone-test-apk` and install it on your phone first (allow "install unknown apps" once).
   Play a lesson and a battle. Check Back, full screen, sound stopping when you switch app,
   and the WhatsApp share. Then download `vyuha-play-bundle` — that .aab goes to Play.
5. **Play Console** (play.google.com/console, one-time US$25 fee): *Create app* → name **VYUHA**,
   Game, Free.
   - **App content:** Privacy policy = the URL above · Ads = **No** · App access = all open, no
     login · Content rating questionnaire = strategy game, stylised battle, no blood, no gambling,
     no user chat (expect *Everyone 10+ / PEGI 7*-ish) · Target audience = **13 and over**
     (avoid "under 13": it brings the Families rules) · Data safety = **no data collected, no data
     shared** (true: no accounts, analytics or ads; scores stay on the phone) · News app = No ·
     Government app = No · Financial features = none.
   - **Store listing:** short and full description, the 512 icon, the feature graphic, at least
     2 phone screenshots (use `store/landscape-*` and `store/portrait-*`), category **Strategy**,
     a contact email.
6. **Closed test — 12 testers for 14 days.** A personal developer account made after
   13 Nov 2023 must run a closed test with at least 12 testers opted in continuously for the last
   14 days before it may ask for production. Upload the .aab to *Testing → Closed testing*, add
   12+ Gmail addresses (the T-05 playtesters count), send them the opt-in link, and ask them to
   keep it installed and play a few times. *(An Organisation account — e.g. the clinic's — skips
   this, but needs a D-U-N-S number.)*
7. After 14 days: *Apply for production*, answer the questions about the test, then publish.

Every later update: raise `versionCode` by one in `android/app/build.gradle`, run the workflow,
upload the new .aab.

## Words for the listing — check before pasting

The 29 Oct draft in `incoming/text/store-listing.md` is good, with three things now out of date:

- "the guided first battle … PEHLA YUDDH" → the game now teaches with **four short wheel lessons**,
  one idea each.
- "browser edition … keep a backup if you clear browser data" → the app is **fully offline**; saves
  stay on the phone; uninstalling deletes them.
- Fields now **unlock as you play** (level 1–6, free, T-34): say "four battlefields to unlock",
  not "four battlefields".

Title (30 characters max): `VYUHA: Chakravyuha Strategy` (27) · Short description (80 max):
`Read hidden ranks, wield astras, and break the Daily Chakravyuha.` (65).

## Not done, and why

- **Built, not installed.** GitHub Actions built it on PR #37 (bundle 33 MB, test APK 34 MB).
  Nobody has opened the app on a phone yet (T-42).
- **Sideways lock.** In the browser the battle turns the screen sideways; the app follows the
  phone's own rotation instead (both layouts work). A rotation plugin can come later if wanted.
- **Hindi and Marathi store listing.** English (and the Hinglish draft) only for now.
- **Tablet layout.** 781–1080 px screens had the field squeezed into a 210 px column; fixed. A
  tablet held sideways (e.g. 1024 × 600) still gets the upright layout with a wide, short field;
  the phone's sideways rails would suit it better (T-44).

## 24 Nov update

- **Builds:** the Android workflow was run by hand on PR #40's branch and succeeded (bundle 33 MB, test APK 34 MB). It does not run on game-file-only PRs (its path filter), so run it by hand before each upload.
- **Store pictures:** now seven sideways and seven upright in `store/` — the new 6 (tap a warrior) and 7 (a rule card) show the primer. Remake with `node tools/store-assets.mjs`.
- **Store words:** the three out-of-date points are fixed in `incoming/text/store-listing.md`, and "backup export" is gone (the buttons were removed). Needs your read (T-43).
- **Settings:** no Export/Import/Reset any more — saves live on the phone and go with the app when it is removed. The listing and privacy page say so.
- **Still only you:** upload key + four GitHub secrets, phone test of the test APK (T-42, T-48), Play Console, the 12-tester 14-day closed test. Nothing in the repository blocks these.
- **Still Director/Sarvam:** Hindi/Marathi for the primer (T-47); Hindi/Marathi store listing; tablet sideways layout (T-44).
