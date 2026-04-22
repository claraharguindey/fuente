const GIF_FUENTE = "img/fountain.gif";
const GIF_BASIN = "img/basin.gif";
const IMG_MONEDA = "img/moneda.png";

const JSONBIN_URL = "https://api.jsonbin.io/v3/b/69e8ddee856a6821895f3de3";
const JSONBIN_KEY = "$2a$10$cac8SVE8FxIXP2f1VeuMU.4Sj.nYbdThz.pufZ4df/pYXI13d8SDa";
// =============================================

document.getElementById("introGif").style.backgroundImage =
  "url('" + GIF_FUENTE + "')";
document.getElementById("basinDiv").style.backgroundImage =
  "url('" + GIF_BASIN + "')";

const COIN_TYPES = {
  1: { label: "Un aprendizaje", placeholder: "Un aprendizaje del proceso..." },
  2: {
    label: "Una pregunta",
    placeholder: "Una pregunta que me queda abierta...",
  },
  3: { label: "Un deseo", placeholder: "Un deseo para la fuente..." },
};

const aText = ["Te acercas a una fuente", "#", "Haz scroll para mirar dentro"];
const bText = ["Miras en tu bolsillo", "#", "Encuentras 3 monedas"];
let delayTime = 0,
  delayAmount = 100;

function typeWriter(textArray, typeDest) {
  typeDest.innerHTML = "";
  delayTime = 0;
  textArray.forEach(function (string) {
    string.split("").forEach(function (letter) {
      delayTime += delayAmount;
      setTimeout(function () {
        if (letter === "#") typeDest.appendChild(document.createElement("br"));
        else typeDest.innerHTML += letter;
      }, delayTime);
    });
  });
}

// ── JSONBIN ────────────────────────────────────────────────
function getCoins() {
  return fetch(JSONBIN_URL + "/latest", {
    headers: { "X-Master-Key": JSONBIN_KEY },
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      return d.record || {};
    })
    .catch(function () {
      return {};
    });
}

function saveCoins(coins) {
  return fetch(JSONBIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_KEY,
    },
    body: JSON.stringify(coins),
  });
}

function addCoin(data, color, nombre) {
  return getCoins().then(function (coins) {
    let id = "coin" + Date.now();
    coins[id] = { data: data, color: color, nombre: nombre };
    return saveCoins(coins);
  });
}
// ──────────────────────────────────────────────────────────

function fade(el, dir, duration, cb) {
  el.style.transition = "opacity " + duration / 1000 + "s";
  el.style.opacity = dir === "in" ? "0" : "1";
  el.style.display = "block";
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      el.style.opacity = dir === "in" ? "1" : "0";
      setTimeout(function () {
        if (dir === "out") el.style.display = "none";
        if (cb) cb();
      }, duration);
    });
  });
}

function show(el) {
  el.style.display = "block";
}
function hide(el) {
  el.style.display = "none";
}
function addClass(el, cls) {
  el.classList.add(cls);
}
function removeClass(el, cls) {
  el.classList.remove(cls);
}

function checkRandom(x, y) {
  const c1 =
    Math.pow(x - 21, 2) / Math.pow(3.95, 2) +
      Math.pow(y - 37.8, 2) / Math.pow(11, 2) <
    1;
  const c2 =
    Math.pow(x - 21.25, 2) / Math.pow(3.9, 2) +
      Math.pow(y - 61, 2) / Math.pow(11, 2) <
    1;
  const c3 =
    Math.pow(x - 28.2, 2) / Math.pow(5.25, 2) +
      Math.pow(y - 48.7, 2) / Math.pow(11.25, 2) <
    1;
  const c4 =
    Math.pow(x - 16, 2) / Math.pow(4.75, 2) +
      Math.pow(y - 50, 2) / Math.pow(9.75, 2) <
    1;
  const c5 =
    Math.pow(x - 18.5, 2) / Math.pow(6.45, 2) +
      Math.pow(y - 49.25, 2) / Math.pow(6.85, 2) <
    1;
  const c6 =
    Math.pow(x - 10, 2) / Math.pow(6.5, 2) +
      Math.pow(y - 49.35, 2) / Math.pow(5.5, 2) <
    1;
  return (c1 || c2 || c3 || c4) && !c5 && !c6;
}
function randomPos() {
  return [Math.random() * 22 + 13, Math.random() * 50 + 25.5];
}

function generateCoins() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  getCoins().then(function (coins) {
    Object.keys(coins).forEach(function (key) {
      const coin = coins[key];
      if (!coin.data) return; // ignorar entradas de init
      let pos = randomPos(),
        tries = 0;
      while (!checkRandom(pos[0], pos[1]) && tries < 200) {
        pos = randomPos();
        tries++;
      }
      const z = Math.floor(Math.random() * 100);
      const el = document.createElement("img");
      el.className = "moneda-en-agua";
      el.src = IMG_MONEDA;
      el.style.cssText =
        "z-index:" + z + ";top:" + pos[0] + "vw;left:" + pos[1] + "vw;";
      (function (c) {
        el.addEventListener("click", function () {
          showCoin(c.color, c.data, c.nombre);
        });
        el.addEventListener("mouseenter", function (e) {
          if (c.nombre) {
            const label = document.getElementById("moneda-label");
            label.textContent = c.nombre;
            label.style.left = e.pageX + 10 + "px";
            label.style.top = e.pageY - 30 + "px";
            label.style.display = "block";
          }
        });
        el.addEventListener("mouseleave", function () {
          document.getElementById("moneda-label").style.display = "none";
        });
      })(coin);
      gallery.appendChild(el);
    });
  });
}

function showCoin(color, data, nombre) {
  const nameHtml = nombre
    ? "<em style='font-size:16pt;opacity:0.5'>" + nombre + "</em><br><br>"
    : "";
  const coinShow = document.getElementById("coin-show");
  coinShow.innerHTML =
    "<img class='moneda-grande' src='" +
    IMG_MONEDA +
    "'>" +
    "<p class='retrieve-text'>" +
    nameHtml +
    data +
    "</p>";
  fade(document.getElementById("about"), "out", 200);
  fade(document.getElementById("tossback"), "in", 300);
  fade(document.getElementById("gallery"), "out", 200);
  fade(document.getElementById("plus"), "out", 200);
  fade(coinShow, "in", 600);
}

let coinColor = "0",
  currentName = "";

document.addEventListener("DOMContentLoaded", function () {
  const typedtext = document.getElementById("typedtext");
  const secondtyped = document.getElementById("secondtyped");

  typeWriter(aText, typedtext);
  setTimeout(function () {
    typedtext.classList.add("active");
    typedtext.addEventListener("click", function () {
      typeWriter(bText, secondtyped);
    });
  }, 55 * delayAmount);

  // Menú +/-
  document.getElementById("plus").addEventListener("click", function () {
    addClass(document.getElementById("plus"), "hide");
    removeClass(document.getElementById("minus"), "hide");
    fade(document.getElementById("menu-container"), "in", 300);
  });
  document.getElementById("minus").addEventListener("click", function () {
    addClass(document.getElementById("minus"), "hide");
    removeClass(document.getElementById("plus"), "hide");
    fade(document.getElementById("menu-container"), "out", 200);
  });

  // About
  document.getElementById("about").addEventListener("click", function () {
    addClass(document.getElementById("about"), "hide");
    removeClass(document.getElementById("about-close"), "hide");
    fade(document.getElementById("about-container"), "in", 300);
  });
  document.getElementById("about-close").addEventListener("click", function () {
    removeClass(document.getElementById("about"), "hide");
    addClass(document.getElementById("about-close"), "hide");
    fade(document.getElementById("about-container"), "out", 200);
  });

  // Seleccionar tipo de moneda
  function selectCoin(colorId) {
    coinColor = colorId;
    const type = COIN_TYPES[colorId];
    fade(document.getElementById("minus"), "out", 200);
    fade(document.getElementById("about"), "out", 200);
    fade(document.getElementById("menu-container"), "out", 200);
    document.getElementById("response").placeholder = type.placeholder;
    document.querySelector(".entry-page").innerHTML =
      "<img class='moneda-entrada' src='" + IMG_MONEDA + "'>";
    currentName = prompt("Como te llamas? (puedes dejarlo en blanco)") || "";
    fade(document.getElementById("coin-input"), "in", 300);
    fade(document.getElementById("nevermind"), "in", 300);
    document.getElementById("response").value = "";
    document.getElementById("response").focus();
    fade(document.getElementById("gallery"), "out", 200);
  }

  document.getElementById("wish").addEventListener("click", function () {
    selectCoin("1");
  });
  document.getElementById("poem").addEventListener("click", function () {
    selectCoin("2");
  });
  document.getElementById("resource").addEventListener("click", function () {
    selectCoin("3");
  });

  document.getElementById("nevermind").addEventListener("click", function () {
    fade(document.getElementById("coin-input"), "out", 200);
    document.querySelector(".entry-page").innerHTML = "";
    fade(document.getElementById("nevermind"), "out", 200);
    fade(document.getElementById("menu-container"), "in", 300);
    fade(document.getElementById("minus"), "in", 300);
    fade(document.getElementById("about"), "in", 300);
  });

  document.getElementById("tossback").addEventListener("click", function () {
    fade(document.getElementById("gallery"), "in", 300);
    fade(document.getElementById("plus"), "in", 300);
    fade(document.getElementById("coin-show"), "out", 200);
    fade(document.getElementById("tossback"), "out", 200);
    fade(document.getElementById("about"), "in", 300);
  });

  // Scroll
  let callIt = 1,
    htmlEl = document.documentElement;
  window.addEventListener("scroll", function () {
    const frac = htmlEl.scrollTop / (htmlEl.scrollHeight - window.innerHeight);
    const basin = document.querySelector(".basin-container");
    const intro = document.querySelector(".introGif-container");
    const toHide = ["coin-show", "coin-input", "gallery"];

    if (frac >= 0.01 && frac <= 0.8) {
      intro.style.visibility = "hidden";
      basin.style.visibility = "hidden";
      basin.style.opacity = "0";
      toHide.forEach(function (id) {
        addClass(document.getElementById(id), "hide");
      });
    } else if (frac > 0.8) {
      basin.style.visibility = "visible";
      basin.style.opacity = "1";
      basin.style.transition = "opacity 0.3s";
      toHide.forEach(function (id) {
        removeClass(document.getElementById(id), "hide");
      });
      if (frac >= 0.99 && callIt === 1) {
        fade(document.getElementById("gallery"), "in", 300);
        generateCoins();
        callIt = 0;
      }
    } else {
      intro.style.visibility = "visible";
      toHide.forEach(function (id) {
        addClass(document.getElementById(id), "hide");
      });
    }
  });

  // Submit
  document
    .getElementById("coin-input")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const texto = document.getElementById("response").value;
      document.querySelector(".entry-page").innerHTML = "";
      fade(document.getElementById("coin-input"), "out", 200);
      fade(document.getElementById("nevermind"), "out", 200);
      fade(document.getElementById("menu-container"), "in", 300);
      fade(document.getElementById("minus"), "in", 300);
      fade(document.getElementById("about"), "in", 300);
      document.getElementById("response").value = "";
      addCoin(texto, coinColor, currentName).then(function () {
        generateCoins();
      });
    });

  // Scroll to top
  document.getElementById("scrollTotop").addEventListener("click", function () {
    typedtext.classList.remove("active");
    typeWriter(aText, typedtext);
    setTimeout(function () {
      typedtext.classList.add("active");
    }, 55 * delayAmount);
  });
});
