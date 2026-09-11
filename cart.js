(function () {
  var KEY = "gamma7_cart";

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    updateBadges(items);
  }

  function count(items) {
    return (items || read()).reduce(function (n, i) {
      return n + i.quantity;
    }, 0);
  }

  function updateBadges(items) {
    var n = count(items);
    var nodes = document.querySelectorAll("[data-cart-count]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = n;
      nodes[i].hidden = n === 0;
    }
  }

  function add(productId, quantity) {
    quantity = quantity || 1;
    var items = read();
    var existing = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].productId === productId) {
        existing = items[i];
        break;
      }
    }
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId: productId, quantity: quantity });
    }
    write(items);
  }

  window.Gamma7Cart = { read: read, write: write, add: add, count: count };
  document.addEventListener("DOMContentLoaded", function () {
    updateBadges(read());
  });
})();
