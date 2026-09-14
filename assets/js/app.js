/* ===========================================================================
   EDIS - shared shell and helpers
   Injects the masthead and footer so navigation lives in one place, then
   provides small utilities used across pages: mobile menu, tabs, filters,
   SVG bar / line / choropleth helpers and the model-chain renderer.
   =========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- config */
  var SITE = {
    org: "Economic Development Intelligence System",
    product: "EDIS",
    productLong: "Economic Development Intelligence System",
    email: "info@edisgov.org",
    website: "www.edisgov.org",
    location: "Nairobi, Kenya",
    phone: "+256 776 130913",
    social: {}
  };
  window.EDIS_SITE = SITE;

  var NAV = [
    { label: "Technology", href: "what-is-edis.html", children: [
      ["what-is-edis.html", "What is EDIS?", "The platform, in plain language"],
      ["how-it-works.html", "How EDIS works", "Question to routed workflow to report"],
      ["agents.html", "AI agents", "Registered agents and the question library"],
      ["models.html", "Models", "The model services behind every number"],
      ["data.html", "Data", "Sources, provenance and quality control"],
      ["gis.html", "GIS", "Maps, layers, catchments and siting"],
      ["simulations.html", "Simulations", "Scenario builder and the run queue"],
      ["reports.html", "Reports", "Generated policy briefs and technical reports"],
      ["api.html", "API", "Programmatic access to indicators and runs"]
    ]},
    { label: "Solutions", href: "solutions.html", children: [
      ["solutions.html", "All solutions", "Every route in: government, sector and institution"],
      ["government.html", "For governments", "Ministries, central banks and statistics offices"],
      ["government-ministry-of-finance.html", "Ministry of Finance", "Envelope, ceilings, appraisal and what the budget buys"],
      ["government-central-bank.html", "Central Bank", "Forecasting, policy simulation and the economy-wide closure"],
      ["government-statistics.html", "Statistics Office", "Accounts, surveys, calibration and governed data APIs"],
      ["sectors.html", "By sector", "Sixteen sector and cross-cutting sheets"],
      ["solutions.html#institutions", "By institution type", "Ten institution types and what each one runs"]
    ]},
    { label: "Academy", href: "academy.html", children: [
      ["academy.html", "EDIS Academy", "Formats, course tracks, certification and fellowships"],
      ["courses.html", "Course catalogue", "Fourteen courses, one for each school"],
      ["academy-calendar.html", "Training calendar", "56 cohorts in Nairobi, Accra and online"],
      ["enrol.html", "Enrol or nominate", "Take a place, or nominate a team from your institution"],
      ["partners.html", "Training partners", "Deliver Academy courses under licence"]
    ]},
    { label: "Pricing", href: "pricing.html", children: [
      ["pricing.html", "Plans and pricing", "Explorer, Professional, institutional and national"],
      ["pricing.html#compare", "Compare plans", "What every plan includes, capability by capability"],
      ["pricing.html#calculator", "Estimate a deployment", "An indicative institutional estimate"],
      ["pricing.html#configurator", "Build your package", "A recommended package for your institution"],
      ["request-quote.html", "Request a quote or demo", "Quotes, proformas, proposals and procurement"]
    ]},
    { label: "Resources", href: "resources.html" },
    { label: "About", href: "about.html", children: [
      ["about.html", "About EDIS", "Purpose, principles and governance"],
      ["about.html#programmes", "The analytical estate", "The models and programmes behind the platform"],
      ["about.html#leadership", "Leadership", "Who directs the work"],
      ["partners.html", "Partners", "Training, research and institutional partners"],
      ["contact.html", "Contact", "Reach the EDIS team"]
    ]}
  ];

  var ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.24 8.25h4.5V24H.24zM8.4 8.25h4.31v2.15h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V24h-4.5v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24H8.4z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.24 2H21.5l-7.13 8.15L22.75 22h-6.56l-5.14-6.72L5.17 22H1.9l7.62-8.71L1.25 2h6.72l4.65 6.15zm-1.15 18h1.81L7.01 3.9H5.06z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>'
  };

  function socialRow(cls) {
    var s = SITE.social, out = "";
    [["linkedin", "LinkedIn"], ["x", "X"], ["youtube", "YouTube"], ["facebook", "Facebook"]].forEach(function (k) {
      if (s[k[0]]) out += '<a href="' + s[k[0]] + '" target="_blank" rel="noopener" aria-label="' + k[1] + '">' + ICONS[k[0]] + "</a>";
    });
    return out ? '<span class="' + cls + '">' + out + "</span>" : "";
  }

  /* ------------------------------------------------------------- masthead */
  function currentPage() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  function buildHeader() {
    var here = currentPage();
    var items = NAV.map(function (n) {
      var active = n.href === here ||
        (n.children || []).some(function (c) { return c[0].split("#")[0] === here; });
      var cls = (n.children ? "has " : "") + (active ? "active" : "");
      var html = '<li class="' + cls.trim() + '"><a href="' + n.href + '">' + n.label + "</a>";
      if (n.children) {
        html += '<div class="dropdown">' + n.children.map(function (c) {
          return '<a href="' + c[0] + '">' + c[1] + "<small>" + c[2] + "</small></a>";
        }).join("") + "</div>";
      }
      return html + "</li>";
    }).join("");

    return '' +
      '<div class="topbar"><div class="wrap">' +
        '<span class="topbar-title">' + SITE.org + "</span>" +
        socialRow("socials") +
      "</div></div>" +
      '<div class="wrap"><nav class="nav" aria-label="Primary">' +
        '<a class="brand" href="index.html">' +
          '<img src="assets/img/logo.png" alt="EDIS logo" width="140" height="140">' +
          '<span class="bt"><b>EDIS</b><span>Economic Development Intelligence System</span></span>' +
        "</a>" +
        '<button class="navtoggle" aria-label="Menu" aria-expanded="false">&#9776;</button>' +
        '<ul class="menu">' + items + "</ul>" +
        '<span class="navcta">' +
          '<a class="btn btn-outline btn-sm" href="login.html">Sign in</a>' +
          '<a class="btn btn-green btn-sm keep" href="demo.html">Ask EDIS</a>' +
        "</span>" +
      "</nav></div>";
  }

  function buildFooter() {
    return '<div class="wrap">' +
      '<div class="foot-grid">' +
        '<div class="foot-brand">' +
          '<img src="assets/img/logo-footer.png" alt="EDIS" width="200" height="200">' +
          "<p>EDIS is the Economic Development Intelligence System. It connects economic models, sector planning " +
          "systems, GIS, public finance and AI agents so that governments and institutions can " +
          "analyse policies, allocate resources and make evidence-based development decisions.</p>" +
          socialRow("foot-soc") +
        "</div>" +
        "<div><h4>Technology</h4>" +
          '<a href="what-is-edis.html">What is EDIS?</a><a href="how-it-works.html">How EDIS works</a>' +
          '<a href="agents.html">AI agents</a><a href="models.html">Models</a>' +
          '<a href="gis.html">GIS</a><a href="api.html">API</a>' +
        "</div>" +
        "<div><h4>Explore</h4>" +
          '<a href="solutions.html">Solutions</a><a href="government.html">For governments</a>' +
          '<a href="sectors.html">By sector</a>' +
          '<a href="academy.html">EDIS Academy</a><a href="pricing.html">Access and pricing</a>' +
          '<a href="resources.html">Resources</a><a href="partners.html">Partners</a>' +
        "</div>" +
        "<div><h4>Contact</h4>" +
          '<a href="mailto:' + SITE.email + '">' + SITE.email + "</a>" +
          '<a href="contact.html">' + SITE.location + "</a>" +
          '<a href="tel:' + SITE.phone.replace(/\s/g, "") + '">' + SITE.phone + "</a>" +
          '<a href="https://www.edisgov.org">edisgov.org</a>' +
          '<a href="request-demo.html">Request a demonstration</a>' +
        "</div>" +
      "</div>" +
      '<div class="foot-bottom">' +
        "<span>&copy; <span id=\"yr\"></span> EDIS &mdash; Economic Development Intelligence System. All rights reserved.</span>" +
        "<span>" + SITE.website + "</span>" +
      "</div></div>";
  }

  function mount() {
    var head = document.querySelector("header.site");
    var foot = document.querySelector("footer.site");
    if (head) head.innerHTML = buildHeader();
    if (foot) foot.innerHTML = buildFooter();

    var yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();

    var tog = document.querySelector(".navtoggle");
    var menu = document.querySelector(".menu");
    if (tog && menu) {
      tog.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        tog.setAttribute("aria-expanded", open ? "true" : "false");
        tog.innerHTML = open ? "&times;" : "&#9776;";
      });
    }
    // touch devices: first tap opens a dropdown instead of following the link
    Array.prototype.forEach.call(document.querySelectorAll(".menu .has>a"), function (a) {
      a.addEventListener("click", function (e) {
        if (window.matchMedia("(max-width:980px)").matches) {
          var li = a.parentNode;
          if (!li.classList.contains("open")) { e.preventDefault(); li.classList.add("open"); }
        }
      });
    });
  }

  /* -------------------------------------------------------------- helpers */
  var H = {};

  H.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  H.badgeClass = function (status) {
    var s = String(status).toLowerCase();
    if (s.indexOf("valid") > -1 || s === "ready" || s === "completed") return "ok";
    if (s.indexOf("partial") > -1 || s.indexOf("review") > -1) return "partial";
    if (s.indexOf("run") > -1 || s.indexOf("validating") > -1) return "run";
    if (s.indexOf("queued") > -1 || s.indexOf("waiting") > -1 || s.indexOf("draft") > -1) return "wait";
    if (s.indexOf("fail") > -1 || s.indexOf("error") > -1 || s.indexOf("missing") > -1 ||
        s.indexOf("non-conv") > -1) return "err";
    return "";
  };

  /* pill-tab controller: buttons carry data-panel, panels carry the id */
  H.tabs = function (tabRoot, panelRoot) {
    var btns = tabRoot.querySelectorAll("button");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(btns, function (o) {
          var on = o === b;
          o.classList.toggle("active", on);
          var p = panelRoot.querySelector("#" + o.getAttribute("data-panel"));
          if (p) p.hidden = !on;
        });
      });
    });
  };

  /* --------------------------------------------------------- SVG charting */
  var PAL = ["#123f63", "#3f9b46", "#c1611f", "#6b4fa1", "#1c6ea4", "#2e8b57"];
  H.palette = PAL;

  /* horizontal or vertical bar chart. data = [[label, value], ...] */
  H.bar = function (data, opts) {
    opts = opts || {};
    var w = 640, rowH = opts.rowH || 34, padL = opts.padL || 168, padR = 62,
        h = data.length * rowH + 16;
    var max = Math.max.apply(null, data.map(function (d) { return Math.abs(d[1]); })) || 1;
    var hasNeg = data.some(function (d) { return d[1] < 0; });
    var zero = hasNeg ? padL + (w - padL - padR) / 2 : padL;
    var span = hasNeg ? (w - padL - padR) / 2 : (w - padL - padR);
    var out = '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
      H.esc(opts.title || "Bar chart") + '">';
    data.forEach(function (d, i) {
      var y = i * rowH + 8, len = Math.abs(d[1]) / max * span;
      var x = d[1] < 0 ? zero - len : zero;
      var col = d[2] || (d[1] < 0 ? "#c1611f" : PAL[i % PAL.length]);
      out += '<text x="' + (padL - 10) + '" y="' + (y + rowH / 2 + 4) + '" text-anchor="end">' +
        H.esc(d[0]) + "</text>";
      out += '<rect x="' + x + '" y="' + (y + 6) + '" width="' + Math.max(len, 1) + '" height="' +
        (rowH - 16) + '" rx="2" fill="' + col + '"/>';
      out += '<text class="lbl" x="' + ((d[1] < 0 ? x - 8 : x + len + 8)) + '" y="' + (y + rowH / 2 + 4) +
        '" text-anchor="' + (d[1] < 0 ? "end" : "start") + '">' +
        H.esc(opts.fmt ? opts.fmt(d[1]) : d[1]) + "</text>";
    });
    if (hasNeg) out += '<line class="ax" x1="' + zero + '" y1="4" x2="' + zero + '" y2="' + (h - 4) + '"/>';
    return out + "</svg>";
  };

  /* multi-series line chart. series = [{name, color, points:[[x,y],...]}] */
  H.line = function (series, opts) {
    opts = opts || {};
    var w = 640, h = opts.h || 260, padL = 52, padR = 16, padT = 14, padB = 30;
    var xs = [], ys = [];
    series.forEach(function (s) {
      s.points.forEach(function (p) { xs.push(p[0]); ys.push(p[1]); });
    });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = opts.y0 !== undefined ? opts.y0 : Math.min.apply(null, ys);
    var y1 = opts.y1 !== undefined ? opts.y1 : Math.max.apply(null, ys);
    if (y1 === y0) y1 = y0 + 1;
    var px = function (x) { return padL + (x - x0) / (x1 - x0 || 1) * (w - padL - padR); };
    var py = function (y) { return padT + (1 - (y - y0) / (y1 - y0)) * (h - padT - padB); };
    var out = '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
      H.esc(opts.title || "Line chart") + '">';
    var ticks = 4, i;
    for (i = 0; i <= ticks; i++) {
      var v = y0 + (y1 - y0) * i / ticks, y = py(v);
      out += '<line class="gl" x1="' + padL + '" y1="' + y + '" x2="' + (w - padR) + '" y2="' + y + '"/>';
      out += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end">' +
        (opts.fmtY ? opts.fmtY(v) : Math.round(v * 10) / 10) + "</text>";
    }
    for (i = x0; i <= x1; i++) {
      if ((i - x0) % (opts.xStep || 1) === 0) {
        out += '<text x="' + px(i) + '" y="' + (h - 8) + '" text-anchor="middle">' + i + "</text>";
      }
    }
    out += '<line class="ax" x1="' + padL + '" y1="' + (h - padB) + '" x2="' + (w - padR) + '" y2="' + (h - padB) + '"/>';
    series.forEach(function (s, si) {
      var d = s.points.map(function (p, k) { return (k ? "L" : "M") + px(p[0]) + " " + py(p[1]); }).join(" ");
      var col = s.color || PAL[si % PAL.length];
      out += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round"/>';
      s.points.forEach(function (p) {
        out += '<circle cx="' + px(p[0]) + '" cy="' + py(p[1]) + '" r="3" fill="' + col + '"/>';
      });
    });
    return out + "</svg>";
  };

  /* schematic district grid used as a stand-in choropleth */
  H.gridMap = function (cells, opts) {
    opts = opts || {};
    var cols = opts.cols || 4, cw = 148, ch = 76, gap = 8;
    var rows = Math.ceil(cells.length / cols);
    var w = cols * (cw + gap) + gap, h = rows * (ch + gap) + gap;
    var vals = cells.map(function (c) { return c[1]; });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var out = '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
      H.esc(opts.title || "Regional map") + '">';
    cells.forEach(function (c, i) {
      var x = gap + (i % cols) * (cw + gap), y = gap + Math.floor(i / cols) * (ch + gap);
      var t = hi === lo ? .5 : (c[1] - lo) / (hi - lo);
      var col = H.ramp(t);
      out += '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch +
        '" rx="4" fill="' + col + '" stroke="#ffffff" stroke-width="2"/>';
      out += '<text x="' + (x + 10) + '" y="' + (y + 26) + '" fill="' + (t > .55 ? "#ffffff" : "#1d2733") +
        '" font-size="12" font-weight="600">' + H.esc(c[0]) + "</text>";
      out += '<text x="' + (x + 10) + '" y="' + (y + 50) + '" fill="' + (t > .55 ? "#e8f2ea" : "#5d6b79") +
        '" font-size="15" font-family="monospace">' + H.esc(opts.fmt ? opts.fmt(c[1]) : c[1]) + "</text>";
    });
    return out + "</svg>";
  };

  /* pale mist to deep green ramp */
  H.ramp = function (t) {
    var a = [232, 242, 236], b = [22, 82, 55];
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); });
    return "rgb(" + c.join(",") + ")";
  };

  /* model chain renderer. steps = [{name, note, status}] */
  H.chain = function (steps, opts) {
    opts = opts || {};
    var rows = steps.map(function (s, i) {
      var st = (s.status || "wait").toLowerCase();
      var cls = st === "run" ? " is-run" : "";
      var label = { ok: "Complete", run: "Running", wait: "Waiting", err: "Failed",
                    queued: "Queued", skip: "Not required" }[st] || st;
      return '<div class="chain-row' + cls + '">' +
        '<span class="i">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="nm">' + H.esc(s.name) + (s.note ? "<small>" + H.esc(s.note) + "</small>" : "") + "</span>" +
        '<span class="badge ' + (st === "ok" ? "ok" : st === "run" ? "run" : st === "err" ? "err" : "wait") +
        '"><span class="dot ' + (st === "ok" ? "ok" : st === "run" ? "run" : st === "err" ? "err" : "wait") +
        '"></span>' + label + "</span></div>";
    }).join("");
    return '<div class="chain">' +
      '<div class="chain-head"><span>' + H.esc(opts.title || "Cross-model workflow") + "</span>" +
      "<b>" + H.esc(opts.run || "") + "</b></div>" +
      '<div class="chain-body">' + rows + "</div></div>";
  };

  window.EDIS = H;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
