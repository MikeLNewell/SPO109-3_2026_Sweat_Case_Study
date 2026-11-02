# Participant S | Hydration and Sodium Laboratory

A student-facing interactive case study for Level 6 Performance Nutrition at the University of Bedfordshire. Based on an anonymised 45-minute laboratory running session on 26 October 2026 and Sage's PhD thesis methods. The application separates measured observations, calculated estimates and hypothetical values used in mathematical predictions.

## Six educational sections

1. Meet the athlete: raw experimental observations and time-series charts.
2. Whole-body sweat: gross mass balance, gas-exchange corrections and all eight metabolic export rows; means use only rows 3–8.
3. Regional sweat: clickable sites, collected sweat mass and local sweat-rate calculations conditional on verified application times.
4. Sodium profile: regional-to-whole-body sodium regression examples, sodium and NaCl conversions, projections.
5. Sodium simulator: McCubbin/Kurtz–Nguyen forward and rearranged models, fluid-replacement curves and sensitivity heatmap.
6. Practitioner decisions: 45-minute, 3-hour and 6-hour scenarios with answer space and self-reveal expert interpretation.

## Run locally

Requires Node.js 22 or later and network access to install npm packages.

```bash
npm install
npm run dev
npm run test
npm run build
```

The compiled site is in `dist/`. The build process is handled automatically by the workflow on pushes to `main`.

## Deploy to GitHub Pages

1. Create a new public GitHub repository, such as `performance-nutrition-sodium-lab`.
2. Upload all files from this folder, including the `.github/workflows/deploy.yml` workflow; commit to `main`.
3. In repository Settings → Pages → Build and deployment, choose **GitHub Actions**.
4. Under the Actions tab, monitor the `Deploy site to GitHub Pages` workflow. The site URL is then shown in the Pages deployment.

The Vite `base: './'` configuration allows deployment from a project URL without changing the base path. Avoid publishing raw exported spreadsheets or documents that contain personal identifiers: only the anonymised `src/data/metabolic.json` is included in this repository.

## Branding

`public/uob-logo.jpg` contains the University of Bedfordshire logo extracted from the supplied, previously branded student profile. The HPC title in the application is a typographic black/red/white treatment. To replace with the official red-and-black HPC logo, add the logo file under `public/` and update the header component in `src/main.tsx`. Do not use older green logo assets.

## Edit the case data

- `src/lib/physiology.ts`: anonymised session observations, sweat-patch mass and sodium, calculations and formulas.
- `src/data/metabolic.json`: eight minute-by-minute metabolic export rows, originating from `Perfrmance Nutrition SS Metabolic measures.xlsx`. Only numerical exercise data were exported, without name/date of birth or other identifying worksheet metadata.
- `src/main.tsx`: labels, interactive student exercises, scenario explanations and controls.
- `src/styles.css`: styling and responsive layouts.

## Mode and data privacy

Student mode gives inputs, check buttons, hints and an optional export. Demonstration mode reveals working answers. The modes are **not** access controlled: source code and answers are inspectable in an ordinary static website. User responses are stored only in that browser's `localStorage` and are not sent to a server. Users can export a Markdown record or reset their work.

## Important scientific assumptions and limitations

- The source recorded urine **osmolality of 260 mOsmol/kg H₂O**, not urine volume. No measured urine output is available.
- The apparent volume ingested is conditional on assuming the bottle contained water, no spillage and 1 g ≈ 1 mL.
- Gross and corrected sweat calculations assume no interval urine/faecal losses. This is unknown, not measured zero.
- Gas-exchange measurements were captured late in the session. Extrapolation of the minutes 3–8 gas-exchange mean across all 45 minutes is for teaching only.
- The left-thigh regional sweat sodium result is flagged because of very low sample volume. This does not erase the measurement or prove it invalid.
- The patch's 10 cm² pad area and 30-minute collection described by Sage were not confirmed for this teaching session. The site prompts for actual area/duration before calculating local rates.
- Baker's regression specifically relates **dorsal forearm** and **ventral thigh** to whole-body sweat sodium. Exact teaching patch placement is unconfirmed. The site enables exploratory application but marks this uncertainty explicitly. There is no valid lower-back regression substitution.
- Serum/plasma sodium, total body water, sweat potassium and urine electrolyte losses were **not measured** in the classroom case. Values used in the simulator are explicitly hypothetical.
- The forward model's default total-body-water projection considers sweat and fluid intake and optional urine, but does not independently model unrecorded endogenous and respiratory water fluxes.
- No serum sodium model should be used as a medical diagnosis or individual prescription. Sage's field work observed wide individual prediction errors.
- Model-derived sodium requirements are not equal to sweat sodium losses, and added sodium is not a method of making excessive drinking safe.

## Calculation methodology

Source derivations and unit conventions are documented in [METHODS.md](METHODS.md). Code tests are in `src/lib/physiology.test.ts`. Verify equations against the research cited below before applying them in any other project.

## Scientific sources

- Sage, S. A. (2026). *Fluid and Electrolyte Balance in Endurance Athletes: From Lab to Field*. University of Bedfordshire PhD thesis. §§3.2.9–3.2.17; Chapters 6–7. Source supplied with the project.
- McCubbin, A. J. (2023; first published online 2022). *Modelling sodium requirements of athletes across a variety of exercise scenarios*. European Journal of Sport Science, 23, 992–1000. https://doi.org/10.1080/17461391.2022.2083526
- Baker, L. B., et al. (2020). *Cross-validation of equations to predict whole-body sweat sodium concentration from regional measures during exercise*. Physiological Reports. https://doi.org/10.14814/phy2.14524
- McCubbin, A. J. (2025). *Sodium intake for athletes before, during and after exercise: review and recommendations*. Performance Nutrition. https://doi.org/10.1186/s44410-025-00011-9
- Kurtz, I. and Nguyen, M. K. (2003). Original modelling framework underpinning the sodium prediction equation.

## Self-contained version (no build required)

The `docs/index.html` file is a self-contained, dependency-free implementation of all six learning sections. It includes student checks, anonymised metabolic tables, patch calculations, a McCubbin/Kurtz–Nguyen model with sensitivity table, and student work export. It also retains responses in local storage. It can be opened locally, or hosted immediately by choosing **Deploy from a branch → main → /docs** in GitHub Pages settings. This is the reliable no-build deployment option.

The React/Vite application under `src/` offers enhanced charts, a graphical body map, and more extensive presentation tools. To deploy that version, choose the GitHub Actions deployment source instead and allow `.github/workflows/deploy.yml` to install dependencies, test and compile the app.

Both versions use the same anonymised case data and scientific equation families; the standalone version's model intentionally omits optional urine inputs that are available in the React version.
