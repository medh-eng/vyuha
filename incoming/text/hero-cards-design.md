# VYUHA — Pata hero cards and turn flows (ChatGPT Batch 6.5)

**15 November 2026 · T-12 · design handoff for the Director.** Design only. No hero gameplay, artwork, or UI was activated by this file. Respect the sequencing in docs/REVIEW.md: the five-person first-session gate (T-05) comes first, then the Seven Vyuhas campaign and Abhimanyu Escape; **heroes remain behind the campaign** unless the Commander explicitly changes that decision.

Sources of truth: docs/DIRECTOR.md §6 (respect); DESIGN.md §§1–5 (Pata, sizes, accessible targets, Calm); docs/PACING.md (one moment at a time); incoming/text/heroes-vows.json (eight traits); js/engine.js (four currently implemented *passive* traits); assets/art/opt/heroes/ (portraits). The existing public-information decision is that each side's **hero name and host rank are public**, but the enemy host's *piece position and identity on the board* remain hidden until ordinary reveal.

## 1. The offer — not another first-session obstacle

- **Do not show a hero choice in Pehla Yuddh, the first Quick battle, Daily, Challenge a friend, or before T-05.** The first learning path must stay one tap to a battle. Once the campaign teaches heroes, make them an optional, explicit choice in Custom battle or a later campaign chapter. A match with no hero works exactly as today.
- Pick **one hero per army**, then a host rank (**Senapati 10** or **Maharathi 9**) that actually exists in the roster. No hero is a separate capturable unit, no extra piece is added, and there is no paid advantage.
- One clear entry on the Custom battle setup summary: “Hero: None” → “Choose hero”. Display a one-sentence trait and host selector; “No hero” is always available. When a hero-bearing campaign chapter is introduced, explain the trait *after* the basic rule it depends on.
- Preserve the existing setup → deployment → battle → result sequence, offline saves, pass-and-play curtain, and seeded challenges. Include hero choice in a challenge's rules payload **only when** the encoding is versioned and can replay the same match; never silently change existing challenge links.

## 2. One reusable hero card

**Data to display** (separate the game rule from lore):

| Place | Content and interaction |
|---|---|
| Setup picker | Portrait (if shipped), name in Latin + Devanagari, one-sentence rule, rank 9/10 selector, status “Available later” for unimplemented heroes, None/Choose. Selecting a card is not locking deployment. |
| Deployment, portrait | A **single small cotton strip** at the top of the action area, above the existing preset/Lock buttons: “Your hero · Bhima — Maharathi (9)”, with a 44 px “Change” target while the match permits selection. Do not push the board out of view. |
| Deployment, landscape | In the **right action rail**, below the selected-piece summary and above Lock: 44 px portrait thumbnail + “Hero: Bhima / 9” and one line for the ability. Expand on tap. It must not widen the centre field or hide the Lock control at 830 × 318. |
| Battle, portrait | One compact “Hero” information button next to the existing HUD controls, opening a non-blocking cotton sheet with **both sides' declared hero names + ranks**. No persistent portrait row that reduces board height. |
| Battle, landscape | Same 44 px “Hero” control in the **left status rail**, with its detail sheet; the right action rail remains for Move/Strike/Confirm/Cancel and four astras. Do not displace GOAL or Shakti. |
| When host selected | Beside the ordinary selected-piece text, a compact “Bhima · Maharathi” tag; the opponent's hidden pieces never gain a special badge, glow, tooltip, or accessibility label revealing the hero-host cell. |
| Result | Below verdict and above secondary details: “Your hero: Bhima — held a tie” or “Your hero: Bhima — not triggered”. Opponent hero: name/rank/trigger status if relevant. **Do not replace or bury the main Rematch/Face next opponent button or Challenge a friend.** |

A card is cotton (#F2E4C4) with an ink (#1C1510) border and text, one thin ink rule under the painting band, restrained vermilion/lapis faction cues, and tiny gold only on an **earned/used** accent. Night backdrop may be indigo (#1F2A5C), but **text on the card remains ink on cotton**. Use flat mineral colour, bold outlines and the correct Pata painting style. No glossy medallion, moving glow, looping ring, watermark, pasted text inside the painting, or deity depiction. Classic bronze remains an independently styled skin, not a Pata card with its colours inverted.

**Portrait mapping:** Arjuna → arjuna.webp; Drona → drona.webp; Abhimanyu → abhimanyu.webp; Bhishma → bhishma.webp; Bhima → bhima.webp; Karna → karna.webp; Ghatotkacha → **ghatotkach.webp** (actual file spelling); Dhrishtadyumna → dhrishtadyumna.webp. These are existing files to assess for suitability; do not claim new Pata hero art is complete. Use a dignified flat silhouette if the existing portrait fails the chosen look or 32–44 px legibility. The name, rank and action must remain understandable when images do not load.

### Wire-frames (not measured screenshots)

Portrait 390 × 844 (deployment; preserve current board size):

    [ existing HUD / field ]
    [ selected piece or deployment instructions ]
    [ HERO: BHIMA · MAHARATHI (9)    Change ]
    [ Durg ] [ Aakraman ] [ Jaal ] [ Shuffle ]
    [ Keep ]                        [ Lock formation ]

Landscape 830 × 318 (battle; do not increase either rail width):

    LEFT STATUS        FIELD (unchanged)       RIGHT ACTIONS
    Round / Hour       [                  ]    Shakti  ●●●○○
    GOAL               [ existing board   ]    Four astras
    [Hero]             [                  ]    Selected unit
    Menu/Log           [                  ]    Move / Confirm / Cancel

Hero sheet, from either [Hero] button:

    [ Your army: Bhima · host rank 9  ]   [ Close ]
    [ Wins an equal-strength melee without shield loss ]
    [ Enemy: Drona · host rank 10     ]
    [ Reveals one adjacent enemy once; host position unknown ]
    [ Ability: ready / used / condition not met ]

**Interaction constraints:** tap target ≥ 44 × 44 px; Escape/Back and a labelled Close; focus stays inside an open modal and returns to the invoking button; the same details are readable with VoiceOver/TalkBack and with no sound. Allow Hindi/Marathi text two lines without making the field scroll or shrinking controls. In pass-and-play, the other side's declared hero/rank can be seen on its turn, but never show any hidden *piece* identity across the curtain.

## 3. Hero action flows — four *future* active heroes

All actions below are specification only. These four are **not** implemented by the existing engine's HEROES registry. Do not expose them as playable until the Director writes the engine, AI, odds, save/migration and test support and the Commander approves their release after the campaign.

### Arjuna — one three-cell volley

1. The selected host is the declared Arjuna host; the power is unused and it is the owner's turn. Show an **“Arjuna volley · once”** 44 px button alongside normal Move/Strike, but never turn the host into a permanent Dhanurdhar.
2. On activation, dim normal target marks and ring **only enemy cells exactly three graph cells away along a legal volley ray**. Tap a target → static saffron ring, target explanation “Three-cell volley — resolves as Dhanurdhar volley”; **Confirm volley** or **Cancel**. No unexplained auto-fire.
3. Confirm consumes exactly one turn and the once-only power. Resolve the same ranked outcomes and exemptions as the normal Dhanurdhar volley (including fort first breach); an astra cannot be combined with it on the same turn. The host does not change its permanent rank or position.
4. Show the ordinary ranged effect and one short Sanjaya beat only if approved; mark “used” after the resolved action. Cancel or an invalid target costs nothing.

### Drona — one adjacent reveal

1. Selected host, unused ability: **“Drona's insight · once”** appears with the normal actions.
2. On tap, put **quiet ink circles** only on adjacent enemy cells, respecting the real board graph. Select one → “Reveal this piece. This takes your whole turn and causes no damage.” **Reveal** / **Cancel**.
3. Confirm reveals both the target and **Drona's host piece** to both players, records the ability as used and consumes one turn. No free information before confirmation, no damage, and no second action in that turn.
4. Result is a finite reveal brush stroke with a readable static fallback; no triumph over a guru in copy, scoring or achievements.

### Abhimanyu — no immediate return; ignores Padma

1. It is a persistent rule on the declared host, **not** a second attack button. On selecting the host, a small tag reads “Through the circle · cannot step back”.
2. Legal destination preview **omits** the immediately previous cell in the piece's movement history; if the player taps it directly, an accessible message explains “Abhimanyu cannot return to his previous cell.” Keep this rule attached to the logical cell ID through ring rotation and wind swaps so neither bypasses it.
3. In strike preview, compute odds without the defending Padma +1 **only for this host**, and say “Enemy Padma guard ignored” in the details. All other protections, traps, fort gate, hours, tie rules, and turn costs remain.
4. On a rotation that changes cell position, preserve the engine's recorded movement semantics; document exact previous-cell behaviour before implementing (it must match the source lore rules). No autoplay “escape” or immunity.

### Bhishma — standing guard aura

1. It is a passive field condition, **not** a new turn action. While Bhishma's host has never moved, **adjacent allied movable fighting pieces** receive their normal single Padma defence bonus with only one supporter. No stacking above Padma +1; forts and traps get none.
2. Once Bhishma moves **or is carried by a field rotation**, mark the aura “ended” for the rest of that battle; do not reactivate it when the host returns. Defeating the host also ends it.
3. The **Hero** sheet shows “Holding the line” or “Guard ended” without a looping aura animation. For visible friendly pieces, use only a tiny static defensive petal cue already consistent with Padma. Do not mark hidden enemy hosts to disclose location.
4. Defensive odds must include the aura only when the defender is really eligible, and enemy-facing probability estimates must not peek at concealed identity.

## 4. The four existing passive traits — card language

These exist in js/engine.js behind explicit match config; they are **not screened or enabled in normal gameplay** merely by writing this design.

| Hero | Player-facing one-line ability | Card state |
|---|---|---|
| Bhima | “Wins equal-strength melee, attack or defence, without shield loss.” | Always active for its host; show “Held a tie” only on a real qualifying clash. |
| Karna | “Once, survives a losing **ordinary melee** by retreating when the rule allows.” | “Armour ready / used”; if a legal retreat was impossible, do not promise survival. No protection from Chara, trap, ranged attacks or astras. |
| Ghatotkacha | “Gets +1 strength in night melee, within the normal bonus cap.” | “Night strength” only in Chandra's hour; cap still applies. |
| Dhrishtadyumna | “First successful gate break by this host gives +1 extra Shakti, up to five.” | “Gate bonus ready / spent”; never grant it on an astra cast by a different piece or on an already-broken gate. |

## 5. Information fairness, saves and localisation

- **Public:** hero key/name, host *rank* and whether a publicly visible ability has been spent. **Secret:** which concealed board token is the host. An unrevealed enemy piece must not be identifiable via hero portrait, unique outline, aural cue, DOM attribute, hover tooltip, label, or any odds calculation that reads its actual hidden rank.
- AI and player odds must condition on **possible** enemy host ranks, not hidden actual piece IDs. A public hero declaration may affect the prior for host rank 9/10; it may not grant AI access to positions. Reuse the actual combat resolver for outcomes, including ties, once-per-game Karna retreat eligibility and Ghatotkacha night cap. This fairness requirement applies before switching the hero feature on.
- Save both sides' chosen hero, host rank, once-used state and any previous-cell/rotation history. Missing hero fields in older saves mean **None**. Version any Challenge a friend payload that includes hero rules; leave existing links playable.
- Proposed translation keys for Sarvam/native review: hero.none, hero.choose, hero.host, hero.rank, hero.ready, hero.used, hero.ended, hero.details, hero.confirm, hero.cancel, hero.enemyUnknown, hero.resultUsed, hero.resultUnused, hero.arjuna.volley, hero.drona.reveal, hero.abhimanyu.backBlocked, hero.bhishma.aura. Keep interpolation placeholders and a terse fallback English string. Do not ship unreviewed Hindi/Marathi as final.

## 6. Director implementation order and acceptance

1. **Wait for T-05 and the campaign gate**, then decide the chapter that introduces a first hero; re-confirm with the Commander that adding hero complexity is justified by player observations.
2. Implement a reusable, responsive card using the existing setup summary, renderActionBar, game HUD and result modal; keep the battlefield dimension invariant in both orientations. No separate always-visible page.
3. Land rules for each active hero separately, with unit tests for costs, turn consumption, legal preview, specials, rotation, once-only state and save/load. Make AI and odds fair **before** allowing them in normal AI games.
4. Balance every playable hero over wheel/padma × veteran/archon and both host ranks at reproducible seeds; target a hero-side **50–58%** on each combination, confirm trait triggers in real games, and rescreen any revision. The existing tools/hero-sim.mjs calls Math.random without a CLI seed, so a reproducible-screening upgrade is required before presenting new evidence as repeatable.
5. Exercise portrait **390 × 844 and 360 × 640** and landscape **914 × 411, 844 × 390 and 830 × 318**: field unchanged, no sideways overflow, Lock/Confirm/Cancel visible, both skins, both languages when translated, screen reader, one-handed touch, reduced motion and battery saver. Run the full AGENTS.md test matrix and physical-device/real-player checks; record which checks actually ran.
6. Respect test: verify no special animation, message or achievement presents an epic teacher's capture as a victory over a guru. No deities as pieces or capture targets. Ask the three-person review group about this before release.

**Handoff:** This file completes **Batch 6.5's written design deliverable**, not the code or balance approval. Batch 6.2 (four-hero screen) and 6.4 (AI hero awareness) remain unimplemented in this branch, deliberately sequenced behind the current campaign/playtest gate.
