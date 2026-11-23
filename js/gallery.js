(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".print-open"));
  var dialog = document.getElementById("lightbox");
  if (!items.length || !dialog) return;

  var img = document.getElementById("lightbox-img");
  var caption = document.getElementById("lightbox-caption");
  var count = document.getElementById("lightbox-count");
  var buy = document.getElementById("lightbox-buy");
  var buyEs = document.getElementById("lightbox-buy-es");
  var closeBtn = dialog.querySelector(".lightbox-close");
  var index = 0;
  var token = 0;
  var lastTrigger = null;

  function show(next) {
    index = (next + items.length) % items.length;
    var btn = items[index];
    var current = ++token;
    var source = btn.querySelector("img");
    var title = btn.getAttribute("data-title") || "";
    var listing = btn.getAttribute("data-etsy");
    caption.textContent = title;
    count.textContent = (index + 1) + " of " + items.length;
    if (buy && listing) {
      buy.href = listing;
      buy.setAttribute("aria-label", "Buy " + title + " on Etsy, $4.99 digital download (opens in a new tab)");
    }
    if (buyEs && listing) {
      buyEs.href = listing;
      buyEs.setAttribute("aria-label", "Comprar " + title + " en Etsy, descarga digital de $4.99 (se abre en una pestaña nueva)");
    }
    img.alt = source ? source.alt : caption.textContent;
    img.width = source ? source.width : 768;
    img.height = source ? source.height : 1152;
    img.onload = null;
    img.onerror = function () {
      if (current !== token) return;
      img.onerror = null;
      img.src = btn.getAttribute("data-fallback");
    };
    img.src = btn.getAttribute("data-full");
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      window.open(btn.getAttribute("data-fallback"), "_blank", "noopener");
    }
  }

  items.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      lastTrigger = btn;
      show(i);
    });
  });

  dialog.querySelector(".lightbox-prev").addEventListener("click", function () {
    show(index - 1);
  });
  dialog.querySelector(".lightbox-next").addEventListener("click", function () {
    show(index + 1);
  });
  closeBtn.addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
  });

  dialog.addEventListener("close", function () {
    img.removeAttribute("src");
    if (lastTrigger) lastTrigger.focus();
  });
})();
