# Ricardian Model

An interactive calculator for the two-country, two-good Ricardian model (Home and Foreign; cheese and wine; labor as the only input), following Krugman, Obstfeld & Melitz, *International Economics*, ch. 3.

Users enter the unit labor requirements (a_LC, a_LW, a*_LC, a*_LW), the labor endowments (L, L*), and Cobb-Douglas utility weights (μ_C + μ_W = 1). The page then shows:

- **Autarky** for each country: relative price, labor allocation, production = consumption, wage and utility.
- **Free trade**: world relative price, production, consumption, exports/imports, wages, the relative wage, and gains from trade.
- The world **relative supply / relative demand** diagram, plus a step-by-step derivation for the current numbers.

Wine is the numeraire (P_W = 1).

## Files

- `index.html`: the page (no build step, no external libraries).
- `ricardo.js`: the model math. It can also be used from Node: `require("./ricardo.js")`.

## Publishing

Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
