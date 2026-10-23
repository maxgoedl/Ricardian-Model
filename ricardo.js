// Ricardian model: 2 countries (Home, Foreign), 2 goods (Cheese, Wine), labor only.
// Preferences: Cobb-Douglas U = C^muC * W^muW with muC + muW = 1.
// Prices: wine is the numeraire (P_W = 1), so p = P_C / P_W and all values are in units of wine.

(function (root) {
  "use strict";

  // A country is { aLC, aLW, L }.

  function utility(C, W, muC) {
    return Math.pow(C, muC) * Math.pow(W, 1 - muC);
  }

  // Given production and the world price, compute income, consumption, trade, wage, utility.
  function demandSide(c, QC, QW, p, muC) {
    var I = p * QC + QW;            // income = value of production
    var C = muC * I / p;            // Cobb-Douglas: spend share muC on cheese
    var W = (1 - muC) * I;          // and share muW on wine
    return {
      LC: c.aLC * QC, LW: c.aLW * QW,
      QC: QC, QW: QW, income: I,
      C: C, W: W,
      netExportsC: QC - C,          // > 0 exports, < 0 imports
      netExportsW: QW - W,
      wage: Math.max(p / c.aLC, 1 / c.aLW),   // wage in units of wine
      U: utility(C, W, muC)
    };
  }

  function autarky(c, muC) {
    var p = c.aLC / c.aLW;
    var QC = muC * c.L / c.aLC;
    var QW = (1 - muC) * c.L / c.aLW;
    var r = demandSide(c, QC, QW, p, muC);
    r.p = p;
    return r;
  }

  function freeTrade(H, F, muC) {
    var muW = 1 - muC;
    var pH = H.aLC / H.aLW, pF = F.aLC / F.aLW;
    var res = { pH: pH, pF: pF };

    // Identical relative costs: no comparative advantage, no gains from trade.
    if (Math.abs(pH - pF) <= 1e-12 * Math.max(pH, pF)) {
      var aH = autarky(H, muC), aF = autarky(F, muC);
      res.kase = "equal";
      res.p = pH;
      res.home = demandSide(H, aH.QC, aH.QW, pH, muC);
      res.foreign = demandSide(F, aF.QC, aF.QW, pF, muC);
      return finish(res);
    }

    // X = cheese exporter (lower relative cost of cheese), Y = wine exporter.
    var homeIsX = pH < pF;
    var X = homeIsX ? H : F, Y = homeIsX ? F : H;
    var pX = Math.min(pH, pF), pY = Math.max(pH, pF);

    // Price if both specialize completely:  p * (L_X / aLC_X) = (muC/muW) * (L_Y / aLW_Y)
    var cheeseSpec = X.L / X.aLC;       // X's max cheese
    var wineSpec = Y.L / Y.aLW;         // Y's max wine
    var pStar = (muC / muW) * wineSpec / cheeseSpec;
    res.pStar = pStar;
    res.homeIsX = homeIsX;

    var QX, QY, p;
    if (pStar < pX) {
      // Demand for cheese too low: X produces both goods, price = X's autarky price.
      p = pX;
      res.kase = "X-diversifies";
      var worldIncome = X.L / X.aLW + wineSpec;      // X's income at p = pX is L_X * w_X = L_X / aLW_X
      var xC = muC * worldIncome / p;                 // all cheese comes from X
      QX = { QC: xC, QW: (X.L - X.aLC * xC) / X.aLW };
      QY = { QC: 0, QW: wineSpec };
    } else if (pStar > pY) {
      // Demand for cheese very high: Y produces both goods, price = Y's autarky price.
      p = pY;
      res.kase = "Y-diversifies";
      var worldIncome2 = p * cheeseSpec + Y.L / Y.aLW;
      var yW = muW * worldIncome2;                    // all wine comes from Y
      QX = { QC: cheeseSpec, QW: 0 };
      QY = { QC: (Y.L - Y.aLW * yW) / Y.aLC, QW: yW };
    } else {
      p = pStar;
      res.kase = "complete";
      QX = { QC: cheeseSpec, QW: 0 };
      QY = { QC: 0, QW: wineSpec };
    }

    res.p = p;
    var rX = demandSide(X, QX.QC, QX.QW, p, muC);
    var rY = demandSide(Y, QY.QC, QY.QW, p, muC);
    res.home = homeIsX ? rX : rY;
    res.foreign = homeIsX ? rY : rX;
    return finish(res);
  }

  function finish(res) {
    res.relWage = res.home.wage / res.foreign.wage;
    res.worldQC = res.home.QC + res.foreign.QC;
    res.worldQW = res.home.QW + res.foreign.QW;
    return res;
  }

  var api = { autarky: autarky, freeTrade: freeTrade, utility: utility };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Ricardo = api;
})(this);
