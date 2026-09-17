/* ===========================================================================
   EDIS pricing — page rendering
   Reads window.EDIS_PRICING and renders the plan cards, the billing toggle,
   the comparison table, implementation, training, development access, add-ons,
   sector bands, the institutional estimator, the package configurator and the
   FAQ. No figure is written here; every number comes from the canonical record.
   =========================================================================== */
(function () {
  "use strict";
  var P = window.EDIS_PRICING, H = window.EDIS;
  if (!P || !document.getElementById("plans-individual")) return;

  var money = P.money, esc = H.esc;
  var period = "monthly";

  /* ----------------------------------------------------------- plan cards */
  function planCard(p) {
    var s = P.annualSaving(p), out = [];
    out.push('<article class="plan' + (p.featured ? " plan--featured" : "") + '">');
    if (p.badge) out.push('<div class="plan-badge">' + esc(p.badge) + "</div>");
    out.push('<div class="plan-head">');
    out.push("<h3>" + esc(p.name) + "</h3>");
    out.push('<p class="plan-tag">' + esc(p.tagline) + "</p>");
    out.push("</div>");

    out.push('<div class="plan-price">');
    if (p.billing === "free") {
      out.push('<span class="amt">Free</span><span class="per">permanently</span>');
      if (p.monthlyTo) {
        out.push('<div class="plan-save">Extended Explorer access up to ' +
                 money(p.monthlyTo) + " a month</div>");
      }
    } else if (p.billing === "custom") {
      out.push('<span class="amt">Custom</span><span class="per">typically from ' +
               money(p.annualFrom) + " a year</span>");
    } else if (p.billing === "seat") {
      /* published as an indicative band, not one figure */
      var ab = P.annualBand(p);
      out.push('<span class="amt" data-monthly="' + P.band(p.monthlyFrom, p.monthlyTo) +
               '" data-annual="' + P.band(ab.from, ab.to) + '">' +
               P.band(p.monthlyFrom, p.monthlyTo) + "</span>" +
               '<span class="per" data-monthly="per user, per month" ' +
               'data-annual="per user, per year">per user, per month</span>');
      if (s) out.push('<div class="plan-save">Annual billing is ' + P.ANNUAL_MONTHS +
                      " months &mdash; " + s.months + " months free, saving " +
                      P.band(s.from, s.to) + " a user</div>");
    } else {
      out.push('<span class="pre">From</span><span class="amt">' + money(p.annualFrom) +
               '</span><span class="per">per year</span>');
      if (p.typical) out.push('<div class="plan-save">Typically ' + money(p.typical[0]) +
                              " to " + money(p.typical[1]) + " a year</div>");
    }
    out.push("</div>");

    out.push('<dl class="plan-meta">' +
      "<div><dt>Users</dt><dd>" + esc(p.users.label) + "</dd></div>" +
      "<div><dt>EDIS AI</dt><dd>" + esc(p.aiQueries.label) + "</dd></div>" +
      "</dl>");

    if (p.inherits) {
      var base = P.plan(p.inherits);
      out.push('<p class="plan-inherit">Everything in ' + esc(base.name) + ", plus:</p>");
    }
    out.push('<ul class="plan-list">' + p.includes.map(function (x) {
      return "<li>" + esc(x) + "</li>";
    }).join("") + "</ul>");

    if (p.excludes) {
      out.push('<p class="plan-not"><strong>Not included.</strong> ' +
               esc(p.excludes.join(", ")) + ".</p>");
    }
    out.push('<p class="plan-aud"><strong>For.</strong> ' + esc(p.audience.join(", ")) + ".</p>");
    out.push('<a class="btn ' + (p.featured ? "btn-green" : "btn-outline") +
             ' plan-cta" href="' + esc(p.cta.href) + '">' + esc(p.cta.label) + "</a>");
    out.push("</article>");
    return out.join("");
  }

  function group(id, g) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = P.PLANS.filter(function (p) { return p.group === g; })
                                  .map(planCard).join("");
  }
  group("plans-individual", "individual");
  group("plans-institutional", "institutional");
  group("plans-national", "national");

  /* ------------------------------------------------------- billing toggle */
  var note = document.getElementById("bill-note");
  function setPeriod(next) {
    period = next;
    [].forEach.call(document.querySelectorAll(".billtoggle button"), function (b) {
      b.classList.toggle("active", b.getAttribute("data-period") === next);
    });
    [].forEach.call(document.querySelectorAll(".plan-price [data-" + next + "]"), function (el) {
      el.textContent = el.getAttribute("data-" + next);
    });
    var pro = P.plan("professional"), s = P.annualSaving(pro);
    note.textContent = next === "annual"
      ? "Annual billing is " + P.ANNUAL_MONTHS + " months: " + s.months +
        " months free on every individual plan."
      : "Save with annual billing — " + s.months + " months free.";
  }
  [].forEach.call(document.querySelectorAll(".billtoggle button"), function (b) {
    b.addEventListener("click", function () { setPeriod(b.getAttribute("data-period")); });
  });
  setPeriod("monthly");

  /* ----------------------------------------------------- comparison table */
  (function () {
    var t = document.getElementById("cmp");
    if (!t) return;
    var head = '<thead><tr><th class="cmp-feat">Capability</th>' +
      P.PLANS.map(function (p) {
        return '<th class="c">' + esc(p.name.replace("EDIS ", "")) + "</th>";
      }).join("") + "</tr></thead>";
    var cell = {
      full: '<span class="yes">&#10003;</span>',
      limited: '<span class="lim">Limited</span>',
      addon: '<span class="add">Add-on</span>',
      custom: '<span class="cus">Custom</span>'
    };
    var body = "<tbody>" + P.FEATURES.map(function (f) {
      return '<tr><td class="cmp-feat"><span class="tip" tabindex="0">' + esc(f[1]) +
        '<span class="tipbox">' + esc(f[2]) + "</span></span></td>" +
        P.PLANS.map(function (p) {
          var a = p.entitlements[f[0]];
          return '<td class="c">' + (cell[a] || '<span class="no">&ndash;</span>') + "</td>";
        }).join("") + "</tr>";
    }).join("") + "</tbody>";
    t.innerHTML = head + body;
  })();

  /* --------------------------------------------- implementation + training */
  function rows(id, head, body) {
    var t = document.getElementById(id);
    if (t) t.innerHTML = "<thead><tr>" + head.map(function (h) {
      return "<th" + (h.c ? ' class="c"' : "") + ">" + esc(h.t || h) + "</th>";
    }).join("") + "</tr></thead><tbody>" + body + "</tbody>";
  }

  document.getElementById("impl-includes").innerHTML =
    P.IMPLEMENTATION_INCLUDES.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");

  rows("impl-table", ["Plan", "Implementation"], P.IMPLEMENTATION.map(function (i) {
    var p = P.plan(i.plan);
    var v = i.custom ? "Custom"
          : (i.from === 0 ? i.label
             : "From " + money(i.from) + (i.to ? " to " + money(i.to) : ""));
    return '<tr><td class="rowlabel">' + esc(p ? p.name : i.plan) + "</td><td>" + esc(v) + "</td></tr>";
  }).join(""));

  document.getElementById("train-topics").textContent = P.TRAINING_TOPICS.join(" · ");
  rows("train-table", ["Training", "Indicative fee"], P.TRAINING.map(function (t) {
    var v = t.custom ? "Request a quote"
          : money(t.from) + " to " + money(t.to) + " per " + t.unit;
    return '<tr><td class="rowlabel">' + esc(t.name) + "</td><td>" + esc(v) + "</td></tr>";
  }).join(""));

  /* -------------------------------------- development access, add-ons, sectors */
  rows("dev-table", ["Country classification", "Development access discount"],
    P.COUNTRY_BANDS.map(function (b) {
      var v = b.discount[1] === 0 ? "Standard price"
            : "Up to " + Math.round(b.discount[0] * 100) + "–" +
              Math.round(b.discount[1] * 100) + " %";
      return '<tr><td class="rowlabel">' + esc(b.name) + "</td><td>" + esc(v) + "</td></tr>";
    }).join(""));

  rows("addon-table", ["Add-on", "Indicative"], P.ADDONS.map(function (a) {
    var v = a.custom ? "Custom" : "From " + money(a.from) + " to " + money(a.to) + " a " + a.unit;
    return '<tr><td class="rowlabel">' + esc(a.name) + "</td><td>" + esc(v) + "</td></tr>";
  }).join(""));

  rows("sector-table", ["Sector package", "Indicative a year"], P.SECTOR_PACKAGES.map(function (s) {
    return '<tr><td class="rowlabel">' + esc(s.name) + "</td><td>" +
      money(s.from) + " to " + money(s.to) + "</td></tr>";
  }).join(""));

  /* -------------------------------------------------------- the estimator */
  (function () {
    var band = document.getElementById("calc-band"),
        inst = document.getElementById("calc-inst"),
        users = document.getElementById("calc-users"),
        sect = document.getElementById("calc-sectors"),
        impl = document.getElementById("calc-impl"),
        train = document.getElementById("calc-training"),
        out = document.getElementById("calc-out");
    if (!out) return;

    P.COUNTRY_BANDS.forEach(function (b) {
      band.add(new Option(b.name, b.id));
    });
    band.value = "low";
    P.INSTITUTION_PACKAGES.forEach(function (i) { inst.add(new Option(i.name, i.id)); });
    P.SECTOR_PACKAGES.forEach(function (s) { sect.add(new Option(s.name, s.id)); });

    function chosenSectors() {
      return [].filter.call(sect.options, function (o) { return o.selected; })
               .map(function (o) {
                 return P.SECTOR_PACKAGES.filter(function (s) { return s.id === o.value; })[0];
               });
    }

    /* The plan a deployment lands on: the institution's recommendation, raised
       if the user count exceeds that plan's band. */
    function planFor(instId, n) {
      var rec = P.INSTITUTION_PACKAGES.filter(function (i) { return i.id === instId; })[0];
      var p = P.plan(rec ? rec.plan : "ministry");
      var ladder = ["team", "sector", "ministry", "government_enterprise", "national"];
      var idx = ladder.indexOf(p.id);
      if (idx < 0) idx = 2;
      while (idx < ladder.length - 1 && P.plan(ladder[idx]).users.max && n > P.plan(ladder[idx]).users.max) {
        idx++;
      }
      return P.plan(ladder[idx]);
    }

    function draw() {
      var n = Math.max(1, parseInt(users.value, 10) || 1);
      var p = planFor(inst.value, n);
      var secs = chosenSectors();

      /* subscription: the plan floor, plus additional sectors beyond the first */
      var subLow = p.annualFrom || 0, subHigh = (p.typical && p.typical[1]) || subLow;
      if (secs.length) {
        var first = secs[0];
        subLow = Math.max(subLow, first.from);
        subHigh = Math.max(subHigh, first.to);
        var extra = P.ADDONS[0];               /* additional sector */
        for (var i = 1; i < secs.length; i++) {
          subLow += extra.from; subHigh += extra.to;
        }
      }

      /* implementation from the plan's band, scaled by the chosen level */
      var im = P.IMPLEMENTATION.filter(function (x) { return x.plan === p.id; })[0] || {};
      var iLow = im.custom ? 0 : (im.from || 0), iHigh = im.custom ? 0 : (im.to || iLow);
      var scale = impl.value === "extended" ? 1.5 : impl.value === "minimal" ? 0.6 : 1;
      iLow = Math.round(iLow * scale); iHigh = Math.round(iHigh * scale);

      /* training at the advanced band */
      var tp = Math.max(0, parseInt(train.value, 10) || 0);
      var tBand = P.TRAINING[1];
      var tLow = tp * tBand.from, tHigh = tp * tBand.to;

      var opts = [];
      if (document.getElementById("calc-api").checked) opts.push("Custom API integration");
      if (document.getElementById("calc-cloud").checked) opts.push("Dedicated cloud environment");
      if (document.getElementById("calc-support").checked) opts.push("Premium support");

      var dLow = P.developmentAccess(subLow, band.value),
          dHigh = P.developmentAccess(subHigh, band.value);
      var b = dLow.band;
      var adjLow = dLow.low, adjHigh = dHigh.high;

      var firstLow = adjLow + iLow + tLow, firstHigh = adjHigh + iHigh + tHigh;

      out.innerHTML =
        '<div class="estimate">' +
          '<div class="est-flag">Indicative estimate &mdash; final commercial proposal subject to AICTEM review</div>' +
          "<h3>" + esc(p.name) + "</h3>" +
          '<p class="muted small">' + n + " users" +
            (secs.length ? " &middot; " + secs.length + " sector package" + (secs.length > 1 ? "s" : "") : "") +
            (b && b.discount[1] ? " &middot; development access applied (" + esc(b.name) + ")" : "") +
          "</p>" +
          '<dl class="est-list">' +
            "<div><dt>Indicative subscription</dt><dd>" + money(adjLow) + " to " + money(adjHigh) + " a year</dd></div>" +
            "<div><dt>Indicative implementation</dt><dd>" +
              (im.custom ? "Custom" : (iLow ? money(iLow) + " to " + money(iHigh) + " one-time" : "Minimal or included")) +
            "</dd></div>" +
            "<div><dt>Indicative training</dt><dd>" +
              (tp ? money(tLow) + " to " + money(tHigh) + " for " + tp + " participants" : "Included in the licence credits") +
            "</dd></div>" +
            '<div class="est-total"><dt>Indicative first year</dt><dd>' + money(firstLow) + " to " + money(firstHigh) + "</dd></div>" +
            '<div class="est-total"><dt>Indicative recurring</dt><dd>' + money(adjLow) + " to " + money(adjHigh) + " a year</dd></div>" +
          "</dl>" +
          (opts.length ? '<p class="small muted">Priced separately: ' + esc(opts.join(", ")) + ".</p>" : "") +
          '<p class="small muted">Excludes taxes and duties. Institutional pricing is contracted, ' +
          "and reflects model configuration, national data integration, calibration, training and " +
          "support rather than a seat count.</p>" +
          '<p class="btnrow"><a class="btn btn-green" href="request-quote.html?plan=' +
            encodeURIComponent(p.id) + "&users=" + n +
            (secs.length ? "&sectors=" + encodeURIComponent(secs.map(function (s) { return s.id; }).join(",")) : "") +
            "&band=" + encodeURIComponent(band.value) +
            '&intent=quote">Request a formal quote</a>' +
          '<a class="btn btn-outline" href="request-quote.html?intent=demo">Request a demonstration</a></p>' +
        "</div>";
    }
    [band, inst, users, sect, impl, train,
     document.getElementById("calc-api"), document.getElementById("calc-cloud"),
     document.getElementById("calc-support")].forEach(function (el) {
      el.addEventListener("change", draw);
      el.addEventListener("input", draw);
    });
    draw();
  })();

  /* ----------------------------------------------------- the configurator */
  (function () {
    var inst = document.getElementById("cfg-inst"),
        mods = document.getElementById("cfg-modules"),
        out = document.getElementById("cfg-out");
    if (!out) return;

    P.INSTITUTION_PACKAGES.forEach(function (i) { inst.add(new Option(i.name, i.id)); });

    mods.innerHTML = P.CONFIGURATOR_MODULES.map(function (m) {
      return '<label class="modchk"><input type="checkbox" value="' + m[0] + '"> ' +
        esc(m[1]) + "</label>";
    }).join("");

    function rec() {
      return P.INSTITUTION_PACKAGES.filter(function (i) { return i.id === inst.value; })[0];
    }
    function applyRecommendation() {
      var r = rec();
      [].forEach.call(mods.querySelectorAll("input"), function (c) {
        c.checked = r.modules.indexOf(c.value) > -1;
      });
      draw();
    }
    function draw() {
      var r = rec(), p = P.plan(r.plan);
      var chosen = [].filter.call(mods.querySelectorAll("input"), function (c) { return c.checked; })
                     .map(function (c) {
                       var m = P.CONFIGURATOR_MODULES.filter(function (x) { return x[0] === c.value; })[0];
                       return m ? m[1] : c.value;
                     });
      var recommended = r.modules.map(function (id) {
        var m = P.CONFIGURATOR_MODULES.filter(function (x) { return x[0] === id; })[0];
        return m ? m[1] : id;
      });
      out.innerHTML =
        '<div class="estimate">' +
          '<div class="kicker">Recommended package</div>' +
          "<h3>" + esc(r.name) + " &mdash; " + esc(p.name) + "</h3>" +
          '<p class="plan-price plan-price--inline"><span class="pre">From</span>' +
            '<span class="amt">' + (p.annualFrom ? money(p.annualFrom) : "Custom") + "</span>" +
            '<span class="per">' + (p.annualFrom ? "per year" : "") + "</span></p>" +
          "<h4>AICTEM recommends</h4>" +
          '<p class="chips">' + recommended.map(function (m) {
            return '<span class="chip chip--rec">' + esc(m) + "</span>";
          }).join("") + "</p>" +
          "<h4>Your selection <span class='muted small'>(" + chosen.length + " modules)</span></h4>" +
          (chosen.length
            ? '<p class="chips">' + chosen.map(function (m) {
                return '<span class="chip">' + esc(m) + "</span>";
              }).join("") + "</p>"
            : '<p class="muted small">No modules selected.</p>') +
          '<p class="small muted">Modules beyond the recommended package are priced as add-ons. ' +
          "Implementation, country calibration and training are quoted separately.</p>" +
          '<p class="btnrow"><a class="btn btn-green" href="request-quote.html?plan=' +
            encodeURIComponent(p.id) + "&institution=" + encodeURIComponent(r.id) +
            "&modules=" + encodeURIComponent(chosen.join(", ")) +
            '&intent=proposal">Request a formal proposal</a>' +
          '<a class="btn btn-outline" href="#calculator">Estimate the cost</a></p>' +
        "</div>";
    }
    inst.addEventListener("change", applyRecommendation);
    mods.addEventListener("change", draw);
    applyRecommendation();
  })();

  /* --------------------------------------------------------------- the FAQ */
  var FAQ = [
    ["Why is government pricing different from individual pricing?",
     "An individual buys a seat. A government buys a configured national estate: the models calibrated to its accounts and parameters, its own data integrated under its governance, its analysts trained, its administrators provisioned, and the whole thing supported and reviewed annually. The cost of that work does not scale with logins, so it is priced by institution."],
    ["Can my institution buy only one sector?",
     "Yes. EDIS Sector is exactly that — one line ministry's model, data, dashboards, costing, budget linkage and training. Additional sectors are added as add-ons at any point in the contract year."],
    ["Do you provide discounts for African governments?",
     "Pricing is adjusted against the country's income classification through development access pricing, published above. It is applied at contract."],
    ["Can donors finance our EDIS subscription?",
     "Yes. A deployment can be financed by a development partner, by the government, or shared between a donor, the government and AICTEM. We scope donor-supported deployments with the partner and the beneficiary together."],
    ["Does EDIS include training?",
     "Institutional licences carry training credits, and Sector, Ministry, Government Enterprise, National and Sovereign all include training. Additional places and cohorts are priced per participant or per cohort."],
    ["Can EDIS be deployed in-country?",
     "Yes. A dedicated environment is available as an add-on, and Sovereign Premium includes dedicated infrastructure."],
    ["Can EDIS integrate with government databases?",
     "Yes. Custom data integration is included from Ministry upward and available as an add-on below that. Integration runs under your data governance, and provenance is recorded on every figure."],
    ["Can EDIS be hosted privately?",
     "Yes, as a dedicated cloud environment add-on or as part of a Sovereign Premium contract."],
    ["Is pricing per user?",
     "For Explorer, Professional and Professional Plus, yes. Institutional plans are priced by institution, with a user band rather than a per-seat charge, because what is being licensed is a configured estate rather than access alone."],
    ["Can we start with one ministry?",
     "Yes, and most governments do. A ministry deployment proves the workflow before the estate is widened."],
    ["Can we later upgrade to a national platform?",
     "Yes. Ministry and Government Enterprise contracts are designed to widen into a National Platform, and the configuration and calibration already paid for carry across."],
    ["Does AICTEM provide technical support?",
     "Yes, against the licence. Professional Plus and above carry priority support; Government Enterprise, National and Sovereign carry a named account and implementation team."],
    ["Can EDIS be purchased through a development project?",
     "Yes. We support quotes, proforma invoices, formal proposals, purchase orders and development-partner procurement. Institutional contracts do not require a credit card."],
    ["What happens to our data?",
     "Institutional data is isolated to your organisation, governed by your licence, and never used to serve another institution. Work produced in a workspace can be exported, and the provenance record travels with every figure."]
  ];
  document.getElementById("faq").innerHTML = FAQ.map(function (q, i) {
    return '<details class="faqitem"' + (i === 0 ? " open" : "") + ">" +
      "<summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>";
  }).join("");
})();
