# Handoff — latest status

**15 November 2026 · ChatGPT · T-12, Batch 6.5 (on top of 6.3)**

Batch 6.5's **written design** is delivered at
[incoming/text/hero-cards-design.md](../incoming/text/hero-cards-design.md).
It specifies portrait/landscape Pata placement for the hero picker, battle HUD
and result screen; turn-by-turn previews for Arjuna, Drona, Abhimanyu and Bhishma;
the four implemented passive traits; hidden-information fairness; accessibility,
language keys, balance requirements, and integration acceptance tests. The existing
hero portraits were checked by filename (not visually approved). No gameplay,
art, translation or runtime code changed on this branch. Local browser tests were
not run: only the repository instructions and source files were reviewed.

**Sequencing:** The 13 November hard review still holds: T-05 five real first-time
phone playtests, then the Seven Vyuhas campaign, before implementing/shipping
heroes. Batch 6.2 (the reproducible four-hero balance screen) and 6.4 (hero-aware
AI and fair odds) therefore remain pending for that stage. Existing PR #28
(media QA) and #30 (Quiet Gate) must be merged in that order before this
stacked design branch. PRs #29/#31 are Sarvam's separate stacked translation
work. Do not enable heroes on main from this design alone.

---

**Earlier 15 November 2026 · ChatGPT · T-12, Batch 6.3**

Quiet Gate passed its two-bank screen with four starting Shakti for the defenders.
The four raider win rates were 50.8% and 51.7% in bank 5, and 45.0% and 49.2% in bank 6
(wheel, then lotus). The Director can review the draft for inclusion in the Daily rotation.
The [balance report](balance/README.md#quiet-gate--15-november-2026) includes paired controls,
the seed bases, and replay commands. No catalogue or game behaviour changed.

PR #28 delivers Batch 6.1. Both skins passed all media checks in GitHub Actions. In its
first CI attempt the unrelated battle-log harness stopped at “padma: at least one of
your own moves was checked (0)”. The simulated battle did not supply the move the test
requires. [Job log](https://github.com/medh-eng/vyuha/actions/runs/43699342760/job/132766806259).
This is evidence for the Director’s existing T-22 harness task.

The newer [review plan](REVIEW.md) places heroes after the campaign. The remaining
ChatGPT items within T-12 are the four-hero balance screen, AI hero awareness and
the Pata hero-card design. The campaign awaits T-05, five first-time players on
their own phones. Record observations in the roadmap. Parts 1 and 2 are on main.
Sarvam’s translation submission is in PR #29, with its native review still pending.
