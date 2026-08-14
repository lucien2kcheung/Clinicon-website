# drhauschka.com — what it does well, what it does badly, and what VITAS should take

*Prepared alongside the VITAS website build, August 2026.*

## A note on method (please read this first)

The build environment for this project blocks outbound web traffic to
third-party sites: `drhauschka.com`, `vitas.com.hk`, Watsons and YouTube all
refused to load. This teardown is therefore based on:

- the structure and design language of Dr. Hauschka's site as documented in
  trade press and the brand's own published material about its redesign
  (the skin-consultation tool, the "Plant Heroes" ingredient section, the
  responsive rebuild of the US e-commerce site);
- the brand's well-established positioning (WALA Group, Demeter/biodynamic
  sourcing, NATRUE certification, rhythm-and-ritual philosophy);
- general, verifiable patterns for natural-skincare e-commerce of this type.

Everything in "What it does well" and "What could be improved" is a judgement
about that class of site and the specific patterns Dr. Hauschka is known for.
**Before you use any single point as a fact about their current site, open the
page and confirm it** — a 30-second check per point. The recommendations for
VITAS at the end do not depend on any one of those observations being current.

---

## 1. Why this is a good site to copy

Dr. Hauschka and VITAS have more in common than the categories suggest:

| | Dr. Hauschka | VITAS |
| --- | --- | --- |
| Product | Plant-based skincare | Plant-oil muscle cream |
| Price | Premium vs. mass market | HK$250 vs. HK$30–80 rubs |
| Defence of the premium | Provenance, philosophy, ritual | Currently: claims. Needs to be: sensory + provenance |
| Retail reality | Sold through pharmacies and health stores | Sold through Watsons and Mannings |
| Risk | Over-claiming on plant efficacy | Over-claiming on plant efficacy |

Both are asking a customer to pay several times the category price for a
plant-based product whose functional advantage over cheaper rivals is modest.
Dr. Hauschka has solved that problem for forty years without leaning on
pharmacological claims — which is precisely the problem VITAS has to solve now
that the lymphatic story is off the table. So copying its *structure* is a good
instinct, as long as you copy the discipline as well as the layout.

---

## 2. What Dr. Hauschka does well

### 2.1 The product is never the first thing you meet
The homepage opens with mood, philosophy and season, not a grid of SKUs and a
red discount badge. That single decision does most of the work of justifying the
price: a site that opens with a sale is a site that competes on price. Retail
sites that open with atmosphere read as brands; sites that open with a product
grid read as catalogues.

**Take it.** VITAS has one SKU. Opening on a grid would look absurd; opening on
a mood — the two minutes before training, the ten minutes after — makes a single
product feel like a considered choice.

### 2.2 Ingredients are given narrative status ("Plant Heroes")
Named plants, with their own pages, botany, sourcing and a reason for being in
the formula. This converts an ingredient list — a compliance artefact — into the
brand's main body of content. It gives customers a reason to believe that is
concrete and checkable, without ever claiming a clinical outcome.

**Take it.** This is the single most transferable idea, and the VITAS site now
does exactly this: eucalyptus, grape seed and niaouli each get a role, a Latin
name and an honest description of what they contribute. Three plants is a
*better* story than thirty, if each one earns its place.

### 2.3 A guided tool that converts browsing into a recommendation
The skin consultation / skin test turns "which of these forty products do I
need?" into a short guided conversation. It is the highest-value interactive
element on any skincare site: it captures intent, reduces choice paralysis, and
gives the brand a reason to ask for an email.

**Take it, but rewire it.** VITAS does not need a product recommender — there is
one product. The equivalent question is *how should I use it?*, which is exactly
the question that determines whether a customer finishes the tube and buys
another one. The site now has a three-question "find your routine" finder that
returns one of three usage protocols.

### 2.4 Philosophy is treated as a content pillar, not an About page
Rhythm, biodynamic sourcing, the WALA process, "skin care as a rhythm rather
than a fix" — this is a coherent worldview presented as content, and it is why
the brand can charge a premium without efficacy claims. The customer is buying
into a way of doing things.

**Take it — carefully.** VITAS does not have forty years of anthroposophy, and
inventing one would repeat the mistake the brand just made with the lymphatic
story. What VITAS *does* have is a real, defensible point of view: honest claims,
a short ingredient list, and a sensory advantage (no smell, no grease) that
matters in a dense city with open-plan offices and packed MTR carriages. That is
enough for an "Our approach" page, and it is more credible than borrowed
mysticism.

### 2.5 Restraint in the visual language
Generous white space, muted natural palette, botanical photography, one
typographic voice. Nothing shouts. The design itself is an argument for the
product's gentleness — the medium matches the message.

**Take it.** The VITAS build uses a paper-and-forest palette, a single serif
display face, and a lot of air. The design says "this will not smell like a
pharmacy" before a word is read.

### 2.6 Editorial content with a reason to exist
Advice, rituals, seasonal routines. Content that is useful whether or not you buy
anything builds the search footprint and the trust that a claim-led site cannot.

**Take it.** The journal ships with three articles — including one that corrects
the brand's own former lactic-acid claim. Publishing the correction is stronger
marketing than quietly deleting it: it is the most searchable, most linkable
thing a muscle-cream brand can write, and it inoculates VITAS against a
"debunked" story later.

### 2.7 The retail network is treated as an asset
A store locator, plus a clear route from "I read about this" to "I can buy it in
a shop near me". For a brand whose distribution *is* the asset, this is not a
utility page — it is the conversion path.

**Take it, and lean harder.** VITAS's genuine competitive moat is shelf space in
Watsons and Mannings. The site now treats stockists as a first-class page with
its own nav slot and repeated calls to action, rather than hiding retail behind a
broken own-store checkout.

### 2.8 Certification does the arguing
NATRUE, Demeter and similar marks let a third party make the credibility claim.
It is the cheapest trust you can buy, because you do not have to say anything
yourself.

**Take it where it is true.** "Made in France, EU GMP" is VITAS's version, and it
is currently asserted with nothing behind it. Get the manufacturer's GMP
certificate and the country-of-origin documentation, then say it with a
verifiable reference. An unsubstantiated origin claim is a trade-description risk
as well as a wasted asset.

---

## 3. What could be improved

### 3.1 Discovery is slow if you already know what you want
Atmosphere-first design costs the returning customer time. A site can hold a mood
*and* give a repeat buyer a two-click path to reorder; many natural-beauty sites,
this one included, make the loyal customer walk through the poetry every visit.

**For VITAS:** keep the mood, but never let "where do I buy this" be more than
one click away from any page. The header carries a permanent Buy button for this
reason.

### 3.2 The philosophy can crowd out the practical answer
On rhythm-led skincare sites it is common to read three screens about a plant and
still not know how many times a day to apply the product, whether it stings, or
whether you can wear it under makeup. Practical questions are answered late, in
FAQs, or not at all.

**For VITAS:** the practical answers are the differentiator, so they come first —
does it smell, is it hot or cold, how often, can I use it before exercise. All of
them are on the FAQ, and the top three are in the product page's "What it does /
what it does not do" table.

### 3.3 Ingredient storytelling shades into implied efficacy
"Plant Heroes" is a beautiful device, and it walks a fine line: a plant given a
page, a portrait and a paragraph of botany reads as *active*, whether or not a
functional claim is ever made. Regulators in several markets have taken an
interest in exactly this technique.

**For VITAS this is a specific hazard**, because the brand is coming *out* of a
period of over-claiming and into a category (external analgesics at Watsons) that
sits next to actual medicines. The ingredient pages here are deliberately written
in sensory language — cool, light, low-odour — and the "what it does not do" list
is on the product page, not buried. Have a Hong Kong lawyer read the finished
copy against Cap. 231 before launch anyway.

### 3.4 Heavy imagery, slow pages
Rich photographic sites of this type routinely carry multi-megabyte homepages.
On mobile data — how most Hong Kong customers will arrive, from Instagram or a
YouTube link — every extra second costs conversions and rankings.

**For VITAS:** the entire site is HTML, one CSS file, one small JS file and
vector illustrations. When real photography replaces the placeholders, keep it
under control: AVIF/WebP, `loading="lazy"`, and a hero image budget of ~200KB.
Do not let a photo shoot undo the performance advantage.

### 3.5 The consultation tool asks a lot before it gives anything
Multi-step quizzes that demand an email before showing a result have measurably
worse completion than tools that answer first and ask second.

**For VITAS:** the routine finder gives the answer immediately and asks for
nothing. If you later want emails from it, ask *after* the result, as an optional
"send this routine to me".

### 3.6 Localisation is uneven across markets
Global natural-beauty brands typically run market sites of very different
quality, with the flagship market rich and secondary markets thin or
machine-translated.

**For VITAS this is the trap to avoid entirely.** The old site's English
("Green Flower Patch", "blood tendon bulges") destroyed the premium positioning
faster than any claim could build it. This build treats English and 繁體中文 as
equal citizens — both are hand-written, both live in the HTML, and neither is a
machine translation of the other. In Hong Kong, bilingual is not a
nice-to-have.

### 3.7 Social proof is under-used
For a brand with decades of loyal customers, reviews and user content are
strikingly quiet on natural-skincare sites of this generation — the trust work is
all done by certification and philosophy. That leaves conversion on the table:
review content is the single best-performing element on most product pages.

**For VITAS this is the biggest open opportunity.** There is no review moat in
this category at all — Watsons shows no ratings, the old site showed "be the
first to review". Whoever builds a genuine review base first owns the category's
trust. Start with a sampling programme through gyms and physio clinics, and use a
widget that verifies purchase. Do not seed fake reviews: the existing templated
reseller reviews ("great for my skincare routine", on a muscle cream) are exactly
the kind of thing a sceptical customer notices.

### 3.8 Accessibility is usually the cost of a "quiet" palette
Soft grey-on-cream type, low-contrast buttons and thin weights are the standard
failure mode of this aesthetic — and they fail WCAG contrast minimums.

**For VITAS:** body text here is near-black on paper, the muted grey is reserved
for secondary copy, and every interactive element has a visible focus ring, a
skip link and a real `aria-expanded` state. Re-check contrast after any palette
tweak.

### 3.9 The store locator is a dead end
Locators typically tell you a shop exists, then abandon you: no stock status, no
"buy online instead", no distinguishing between a shop that carries the full
range and one that carries two SKUs.

**For VITAS:** the stockists page links straight to the live product page at each
retailer rather than to a map, which is the right choice for one SKU in a small
city.

### 3.10 Editorial content is disconnected from purchase
Advice articles that never link to the product they are about, or link only via a
generic nav, waste the traffic they earn.

**For VITAS:** every journal article ends in the newsletter block and each one
links back into the routine or product page. Watch it in analytics; if an article
earns traffic but no clicks onward, the article needs a better ending, not more
traffic.

---

## 4. What VITAS should *not* copy

1. **A multi-product architecture.** Categories, filters, ranges and "shop by
   concern" navigation on a one-SKU site look like a shop with empty shelves.
   The nav here is built around understanding and buying one product.
2. **A direct-to-consumer checkout — for now.** The old site's manual QR-code
   payment with a HK$500 daily cap and a screenshot upload was worse than no
   checkout at all. Until there is a real gateway (Stripe or Shopify with Apple
   Pay), send people to Watsons and Mannings, where the money already works. It
   is not a compromise: retail is the asset.
3. **Mysticism as a substitute for evidence.** Dr. Hauschka's philosophy is
   inherited and consistent; a newly-invented equivalent for VITAS would read as
   the lymphatic story in different clothes.
4. **Long ingredient rosters.** Three plants, well explained, is a stronger and
   more honest asset than a list nobody reads.

---

## 5. How this build maps to the analysis

| Dr. Hauschka pattern | VITAS implementation |
| --- | --- |
| Mood-first homepage | Hero: "Warm up quietly. Wind down properly." — no product grid |
| Plant Heroes | `/ingredients/` — three plants, role, botany, honest function |
| Skin consultation tool | `/how-to-use/#finder` — three questions → one of three routines |
| Philosophy pillar | `/approach/` — what we removed, what we will and will not say, the honest case for the price |
| Editorial journal | `/journal/` — three articles, one correcting the brand's own former claim |
| Store locator | `/stockists/` — direct links to Watsons, Mannings, HKTVmall and online pharmacies |
| Certification as trust | "Made in France · EU GMP" — flagged in README as needing substantiation before launch |
| Restrained visual language | Paper/forest palette, one serif voice, vector botanical art, generous white space |
| — (their weakness) | Bilingual EN/繁中 written into the HTML, no JS required to read the site |
| — (their weakness) | Practical answers early: what it does, what it does not do, does it smell |

---

## 6. If you only do five things

1. **Pick the honest positioning and hold it everywhere** — site, packaging,
   Watsons listing, reseller copy. A site that says one thing while the shelf
   says another is worse than either alone.
2. **Fix payments or drop them.** Send traffic to retail until a real gateway
   exists. Every visitor who meets a QR-code-and-screenshot checkout is a
   customer you taught not to trust you.
3. **Start collecting real reviews this quarter.** The category has none. This
   is the cheapest defensible advantage available to VITAS, and it compounds.
4. **Substantiate "Made in France / EU GMP"** with documents you can show, then
   use it hard. It is the only third-party-ish credential the brand has.
5. **Write for the buyer you actually have** — the runner, the climber, the
   person whose shoulders hurt from a keyboard — not the wellness shopper the old
   copy imagined. Fitness micro-influencers and physio clinics, not generic
   detox content.
