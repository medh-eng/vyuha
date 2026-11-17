/* VYUHA — the Android app (Capacitor). Does nothing in a browser.
 *
 * The phone's Back button closes the open card; in a battle it opens the
 * Menu (never quits a battle in one press); on any other screen it goes
 * Home; on Home it leaves the app. When the app goes to the background the
 * music and sound sleep, as they do when a browser tab is hidden.
 * Full screen in the app is native (MainActivity hides the system bars), so
 * the browser's full-screen button and switch are hidden (game.js, ui.js).
 */
(function (root) {
  'use strict';
  const AC = root.AC = root.AC || {};
  const cap = root.Capacitor;
  const isNative = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  AC.native = { isApp: isNative };
  if (!isNative) return;
  document.documentElement.classList.add('in-app');

  const App = cap.Plugins && cap.Plugins.App;
  if (!App || typeof App.addListener !== 'function') return;

  App.addListener('backButton', function () {
    const app = AC.app || {};
    const modals = app.modals || [];
    if (modals.length) { modals[modals.length - 1].close(); return; }
    const side = document.querySelector('.intel-panel.open, .log-panel.open');
    if (side) { side.classList.remove('open'); return; }
    if (app.screen === 'game' && AC.game && AC.game.isActive && AC.game.isActive()) { AC.ui.openPause(); return; }
    if (app.screen && app.screen !== 'home' && app.screen !== 'boot') { if (AC.game) AC.game.state = null; AC.ui.show('home'); return; }
    App.exitApp();
  });

  App.addListener('appStateChange', function (s) {
    if (AC.audio && AC.audio.sleep) AC.audio.sleep(!s.isActive);
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
