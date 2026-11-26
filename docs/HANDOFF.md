# Handoff — latest status

**24 November 2026 · Director (addendum, PR #40).** Settings no longer shows Export/Import/Reset; Intel's army chip is solid with white text; new `js/primer.js` — *Know the battlefield* (board, the two armies, tap-each-warrior panel) then *The rules, one at a time* (11 cards), typed out with a soft key (`type` sound; tap text to finish; honours Reduced motion and Mute). It opens first time from Pehla Yuddh's wheel lessons and from the Field drill (`AC.modes.startDrill`; tests/tools still call `startTutorial` directly), and any time from the lessons list and Rules → "Rules, one at a time". Cache v36. Store: pictures 6–7 (warriors, a rule card) added to `tools/store-assets.mjs` and regenerated; `incoming/text/store-listing.md` fixed (T-43); the 69 new strings are in `incoming/text/primer-strings.en.json` for Sarvam (T-47). Android build run by hand on the branch: succeeded (bundle 33 MB, test APK 34 MB). Checks run, all passing: rules, selfplay 40, daily, languages, ui (236), data, audio, log, readability, first-session, landscape, pace-budget, perf-idle (portrait + 844×390), battle-log (951), shots, playtest-bot ("no problems"). Not phone-tested (T-48, T-42). Hindi/Marathi for `primer.*` / `rule.*` fall back to English until T-47.

**17 November 2026 · Director.** The Commander asked: is everything done and up to date for
Google Play, is there a tutorial, are words and icons big and easy, is the game less confusing —
and do what is needed. One PR, branch `claude/readable-store-ready`.

## What changed

**Play Store** (full guide: `docs/PLAY-STORE.md`)
- `android/` — Capacitor 8 Android project, `com.medheng.vyuha`, target **API 36** (Google's rule
  for new apps since 31 Aug 2026), min API 24. `MainActivity` hides the system bars (swipe to
  peek). Icons from the bronze wheel (adaptive: wheel on `#2B2A44`), splash = cotton + wheel (the
  Capacitor logo is gone). Release signing reads `android/keystore.properties` or the
  `VYUHA_UPLOAD_*` env vars; keys are git-ignored.
- `.github/workflows/android.yml` — builds `vyuha-play-bundle` (.aab) and `vyuha-phone-test-apk`
  on app PRs and by hand. Unsigned until the Commander adds the four secrets.
- `tools/build-www.mjs` → `www/` (git-ignored): only the game files go into the app.
  `npm run android:prepare` = build-www + `cap sync android`.
- `js/native.js` (first script, does nothing in a browser): `AC.native.isApp`; phone Back closes the
  top card → opens Menu in battle → goes Home → leaves the app on Home; `appStateChange` sleeps the
  audio (`AC.audio.sleep`, new; `onVisibility` now takes a forced state and ignores repeats).
  In the app the browser full-screen button and its Settings switch are hidden (`canFull()` false);
  WhatsApp share uses `location.href` so Android opens WhatsApp.
- Fonts bundled: `css/fonts.css` + `assets/fonts/` (Inter latin 400–800, Rozha One and Tiro
  Devanagari Hindi latin + devanagari, OFL) — no Google Fonts request, works offline; the
  standalone build inlines them as data URIs. Offline cache **v35** (adds fonts.css, native.js).
- `privacy.html` — nothing collected; plain words.
- `store/` — 512 icon, 1024×500 feature graphic (the card-duel painting), five sideways
  (1688×860) and five upright (860×1688) screenshots as the app draws them. Remake:
  `node tools/store-assets.mjs`.

**Big words, big buttons** (`tools/readability.mjs`, now in AGENTS.md and CI)
- Floor: no words under 12 px, no button under 40 px on Home, lesson offer, Setup, deploy, battle,
  rules, settings and a lesson at 390×844 and 914×411. Every small `font-size` in `css/app.css`
  was raised (7→11 … 13.5→14.5 px); icon buttons 44 px.
- Upright battle HUD: round and turn on one thin line, then 44 px labelled buttons (Menu, hour,
  clock, Intel, Log; Settings sits in Menu there). Tablets ≥ 700 px: one compact row with Settings
  back. Astras labelled upright too (4 across under "Your move" + Advisor; long names break before
  "astra"). Short upright phones (≤ 760 px tall) drop the rotating tip strip in battle. Field height
  vs main: 360×640 226 px (main 232), 390×844 391 px (main 436).
- Short screens: a card's buttons stick to its foot while the words scroll.
- Locked scenario cards keep a greyed painting and say in ink when they open.

**Less confusion in the lessons** (from the 15 Nov playtest: 15 minutes of explaining)
- `#screen-game[data-lesson]` (from new `AC.modes.lessonStage()`): during a wheel lesson the clock,
  Intel, Log, hour chip, Advisor and rotating tips are hidden; the countdown shows only in lesson 2;
  the pencil-a-guess tip waits for the first real battle. On short sideways screens the action card
  runs to the foot of the rail so Confirm is whole at 830×318.
- The last lesson card names the three hidden buttons (Intel, Log, Advisor); 4 new strings
  `wheel.legend.*` in en/hi/mr (**Hindi and Marathi by the Director — need a native read, T-30**).
  Catalogues 255 keys.

**Tablet fix** — a leftover 210 px grid column squeezed the whole field into 210 px on every
781–1080 px wide screen (most Android tablets). Removed.

## Checks (17 Nov, this branch)
rules 166 · selfplay 40 · daily · languages (255 keys) · ui 223 · data 159 · pace-budget · audio 44 ·
log 18 · shots · landscape 122 · first-session 32 · battle-log 1002 · readability · media-qa —
all passed. Idle heat: every screen under 3 % upright and at 844×390. Robot: the first full run
caught a real regression (the labelled HUD squeezed the 360×640 field to 102 px) — fixed above;
the second full run had one timeout in the phone Daily; replaying the phone set on this branch
and on main side by side: both "no problems" (battles differ run to run — same family as T-22);
the third full run: **no problems** on all four viewports. CI's robot on this PR then hit the
same phone-Daily timeout once. Locally, 3 phone-only + 2 full diagnostic runs were all clean, so
it is intermittent (≈2 of 9 runs here; main's recent CI runs were clean). The robot now prints the
action, the last taps and what lay under the finger when an action does not land — read that
line the next time it fails (T-22, now also covering this).
**Android build (PR #37 workflow): BUILD SUCCESSFUL** — `vyuha-play-bundle` 33 MB (unsigned until
the four secrets exist) and `vyuha-phone-test-apk` 34 MB. The `android-actions/setup-android`
step failed in sdkmanager, so the workflow now uses the runner's own SDK. **Not done:** no phone, APK install or human test of any
of this.

## Waiting on the Commander
T-41 Play steps · T-42 test APK on the phone · T-43 store words · and still T-05 (the gate),
T-25, T-30, T-23, T-02/03/16, T-08.

## Director next
T-44 tablets sideways · T-17, T-21, T-22 · Part 3 waits for T-05.
