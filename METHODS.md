# Scientific calculation audit

## Distinguish observed from assumed

**Recorded**: 69.00 kg pre, 68.55 kg post, bottle 822 g pre and 646 g post, 45-min run; six regional patch weights, Na measurements; eight minute-by-minute cart outputs; urine osmolality 260 mOsmol/kg H₂O.

**Not recorded**: urine **volume**, whole-body sweat sodium, blood sodium, total body water, sweat potassium, exact anatomical orientation of all pads, actual patch duration/area and bottle spill checks.

## Worked verification values (lecturer reference)

These are worked solutions for developer verification; they must not be displayed prematurely in student mode.

| Quantity | Model result / interpretation |
|---|---|
| Positive mass loss | 0.450 kg |
| Signed percentage change | -0.6522% |
| Bottle mass difference | 176 g, conditional ≈176 mL |
| Gross sweat loss (no urine or spill assumed) | 0.626 L |
| Gross whole-body sweat rate | 0.8347 L/h |
| Gas mean VO₂, rows 3–8 | 2.1276 L/min |
| Gas mean VCO₂, rows 3–8 | 2.0168 L/min |
| Gas equation carbohydrate oxidation | ≈2.189 g/min |
| Gas equation fat oxidation | ≈0.176 g/min |
| Non-sweat correction, conditional | ≈0.529 L sweat, ≈0.706 L/h |
| Right dorsal forearm: Na regression | 0.589 × 48 + 14.299 = 42.571 mmol/L |
| Right ventral thigh: Na regression | 0.831 × 46 + 11.775 = 50.001 mmol/L |
| Mean of these *two predictions* | 46.286 mmol/L (not a validated multisite estimator) |

Exact computed values may differ slightly according to rounding and the use of the stored six-minute gas mean.

### Gross sweat balance

`gross sweat loss ≈ pre BM − post BM + fluid intake − urine loss − faecal mass loss` (no solids or other gains). Only valid under explicit assumptions. This uses **positive** net body mass loss, not a negative signed change.

### Non-sweat correction

Per Sage §§3.2.9–3.2.10: `corrected sweat (L) = gross sweat (L) − substrate mass oxidised (kg) + metabolic water (L) − respiratory water loss (L)` (with appropriate other gains/losses if recorded).

`CHO (g/min) = 4.210 × VCO₂ − 2.962 × VO₂`  
`FAT (g/min) = 1.695 × VO₂ − 1.701 × VCO₂`  
`metabolic water (L) = duration(min) × [(0.60 × CHO) + (1.13 × FAT)]/1000`  
`respiratory water (L) = duration(min) × [0.019 × VO₂ × (44 − Pa)]/1000`  
`Pa (mmHg) = 7.500616827 × [0.61078 × exp(17.27 T/(T+237.3)) × RH/100]` (T in °C).

The gas data are not a complete-session average; resulting corrected mass balance is illustrative.

### Local patch calculation

`patch sweat mass (g) = post collection mass − site-specific reference mass`  
`LSR (g/m²/h) = patch sweat mass ÷ (area cm² /10000) ÷ (duration min /60)`.

The arm/thigh standard was **6.678 g**; back standard **6.604 g**. Individual patch duration and area must be confirmed to assign a measured local sweat rate.

### Regional whole-body sodium estimators

Baker's validated site-specific regressions:

- Dorsal forearm: `Na_WB = 0.589 Na_region + 14.299`
- Ventral thigh: `Na_WB = 0.831 Na_region + 11.775`

Our two-prediction mean is labelled exploratory, not a new validated multi-site model. Site orientation in this trial is unconfirmed.

### Sodium units

- `sweat Na mmol = sweat L × whole body sweat Na mmol/L`.
- `elemental Na mg = mmol × 22.98976928`.
- `NaCl equivalent mg = mmol × 58.44277`. These units are not interchangeable.

### Kurtz–Nguyen model

`TBW_post = TBW_pre + fluid intake − sweat volume − urine volume (and any separately measured other water fluxes)`.

`PostNa = [TBW_pre(PreNa + 23.8) + 1.03(Na_intake + K_intake − Na_loss − K_loss)]/TBW_post − 23.8`.

For a target equal to the baseline:

`Na_intake_target = [TBW_post(TargetNa + 23.8) − TBW_pre(BaselineNa + 23.8)]/1.03 + Na_loss + K_loss − K_intake`.

The simulator subtracts sodium already present in the beverage and shows the non-negative **additional** quantity required. An unconstrained negative requirement means that sodium ingestion is not necessary for baseline maintenance under the given inputs, not that the athlete should ingest a negative amount. Predicted sodium may still rise in such a scenario. No laboratory blood measures exist to validate predictions for Participant S.

## Scientific notes

The source thesis prints a percentage mass-change expression whose multiplier appears inconsistent with the stated percent unit; this project uses the mathematical definition ×100. The thesis also uses a symbol `ΔBM` with differing sign conventions between signed body-mass change and positive body-mass loss; functions here use explicitly named positive mass loss.

The commercial metabolic export's substrate values may reflect different stoichiometric/nitrogen-handling assumptions from gas-derived expressions. Never sum or subtract a cart's protein oxidation estimate a second time if the gas equations already embody their own substrate assumptions.

Because the original sheet includes the participant's identifying administrative data, it must not be uploaded to the public site. `src/data/metabolic.json` contains only exercise-row values.
