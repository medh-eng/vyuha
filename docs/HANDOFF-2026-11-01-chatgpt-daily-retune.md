# ChatGPT handoff — Daily retune (Task 3.4)

1 November 2026. Branch: `chatgpt/3.4-daily-retune-20261101`. Base: `ce9c0dee7a08516248a7a3131a426cb0d4f8b4df`.

Delivered one effective knob change for each of the eight held Daily drafts, frozen before a fresh third seed bank. All eight pass the observed 30–55% raider-win screen on wheel and padma, 120 games each. Full paired baseline comparison, reproduction steps, audit trail and limitations: [daily-retune.md](../incoming/text/daily-retune.md). Raw report: [daily-balance-bank3.json](../incoming/text/daily-balance-bank3.json).

No draft was promoted or live behaviour changed. Four adaptive calibration rounds reused bank 2 seeds and do not count as independent evidence. The revised configurations require another independent passing bank before promotion. Keep their knobs fixed for that test; if retuned again, restart the independent confirmation count.

Validation: rules 119/0; self-play 40/0; Daily regressions passed; 5,040 fresh-bank games legal and terminating; all proposal schemas, one-knob differences, seed disjointness, source/input hashes and report totals checked. Browser suites, recordings and physical-phone tests were not rerun for this data-only delivery.

Portrait PR #7, localisation PR #9 and landscape design PR #10 are already open; this task does not duplicate them. Calm pacing remains in Director integration PR #8 and was not modified. Main remains unchanged by this branch.
