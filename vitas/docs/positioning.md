# Positioning and claim rules for VITAS copy

This is the rule set the website copy follows. It exists so that anyone writing
future copy — packaging, retail listings, ads, social — writes the same product.

Source of truth: **VITAS Brand Repositioning Proposal v3.0, Option A**
(selected), plus the HK compliance framework in §08 of that deck.

## The master positioning

> **Activate Circulation. Accelerate Recovery.**
> 「激活循環，加速重生。」
>
> Supporting triptych: **Prime. Perform. Recover.**

Audience: active people 25–45 in Hong Kong — Hyrox competitors, padel players,
running clubs. The product earns its place in the gym bag, not the medicine
cabinet. Ingredient purity is the proof, not a side note: three plant actives,
zero toxins, French formulation since 2003.

### The slogan never travels alone

Every placement of the slogan carries the sensory sub-copy:

> VITAS provides a warming sensation when massaged into muscles before training,
> and a cooling sensation afterwards. These sensory experiences are part of your
> active warm-up and wind-down routine.
>
> 「VITAS 於按摩時帶來溫熱觸感（賽前）與清涼觸感（賽後），融入你的熱身與放鬆步驟。」

Both strings live in `BRAND` in `src/data.mjs`, and the full disclaimer renders
in the footer of every page. If you move the slogan somewhere new, move the
sub-copy with it — that pairing is what keeps "circulation" on the right side of
the line.

## What we say

- Sensory facts: mild cooling, light texture, absorbs in under a minute, faint
  scent that fades, leaves no shine.
- Use facts: apply once or twice daily to clean unbroken skin; a massage medium
  before or after exercise, or on neck and shoulders during a working day.
- Composition facts: eucalyptus (*Eucalyptus globulus*), grape seed
  (*Vitis vinifera*), niaouli (*Melaleuca viridiflora*); no methyl salicylate,
  no camphor, no hormones, no steroids.
- Provenance facts: made in France, EU GMP manufacture. **Only once
  substantiated** — see README launch checklist.
- Habit framing: the value is in doing it consistently, not in a single
  application.

## Red light / green light (deck §08)

**Forbidden — never publish these**

✗ "Cures muscle pain" · ✗ "Eliminates lactic acid" · ✗ "Treats inflammation" ·
✗ "Medical-grade recovery" · ✗ "Clinically proven to heal" · ✗ "100% effective
/ guaranteed" · ✗ "Speeds up lymphatic drainage"

Engages the Pharmacy & Poisons Ordinance (Cap. 138), the Undesirable Medical
Advertisements Ordinance (Cap. 231) and the Trade Descriptions Ordinance
(Cap. 362).

**Approved — these describe sensory experience and formulation facts**

✓ "Warming sensation during massage" · ✓ "Cooling sensation after application" ·
✓ "Light, non-greasy gel texture" · ✓ "Part of your warm-up routine" ·
✓ "Soothing relief you can feel" · ✓ "Natural grape seed & eucalyptus" ·
✓ "No toxins. No harsh chemicals."

## What we do not say

Dropped deliberately, and not to be reintroduced:

| Old claim | Why it is gone |
| --- | --- |
| "Drains / flushes lactic acid" | Contradicted by the evidence. Lactate clears on its own in ~30–60 minutes and is not the cause of DOMS. |
| "Lymphatic management / the lymphatic expert" | No credible basis for a topical cream; also the source of most of the regulatory exposure. |
| Detox, "makes skin fairer", body shaping | Cosmetic-efficacy claims with no support. |
| Menstrual discomfort, migraines, sinuses | Health claims. In Hong Kong these engage the Undesirable Medical Advertisements Ordinance (Cap. 231). |
| "Heart and liver protection", memory, nerve and visual acuity | Medicinal claims for a cosmetic product. |
| "Relieves pain in 1 minute", "100% absorption" | Unmeasurable marketing language. |
| "20 years of French research" | No public substantiation. If documentation exists, it can come back — with the documentation. |
| Re-apply every 3 minutes; cooling = normal, warmth = "very tired", no sensation = "the worst condition" | A pseudo-diagnostic ritual. It is not a measurement of anything, and it triples consumption in a way that reads as a sales device. |

## Tone

- Plain, specific, unhurried. Short sentences. No exclamation marks.
- Concede things freely: cheaper rubs are stronger; a cream is not a warm-up;
  severe pain needs a doctor. Conceding the small point is what makes the main
  point credible at this price.
- Never use a word in English that the Chinese cannot carry naturally, and never
  machine-translate either direction. The two languages are written, not
  converted.

## Two places the brand documents and this site disagree

The VITAS Brand Guidelines v1.0 (2026) are followed here for identity — colour,
type, logo, tone, the "Recovery, by nature" line. Two claims inside them are
**not** carried onto the site, because they are the ones the acquisition review
flagged as indefensible:

| Brand guidelines say | This site says |
| --- | --- |
| "Massage in after effort to help drain lactic acid" | Nothing about lactic acid, except a journal article explaining why the claim is wrong |
| "Pre- and post-workout, plus lymphatic care" | Pre- and post-workout, and desk-bound neck and shoulders |

The retail SKU is still *named* 淋巴管理啫喱膏 on some listings and on packaging.
The FAQ answers that directly rather than pretending otherwise: the name is
acknowledged, the claim is not repeated. When packaging is next reprinted, the
name is the thing to change.

## Legal

The site describes a cosmetic massage product. Before launch, have a Hong Kong
lawyer review the finished copy against:

- the Undesirable Medical Advertisements Ordinance (Cap. 231);
- the Trade Descriptions Ordinance (Cap. 362);
- cosmetic labelling and import requirements for the packaging.

The footer disclaimer on every page ("not a medicine… see a doctor or
physiotherapist") is a minimum, not a substitute for that review.
