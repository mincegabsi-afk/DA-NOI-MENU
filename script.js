let menuData = null;

// Load the full menu from menu.json
async function loadMenu() {
  try {
    const response = await fetch("data/menu.json");
    menuData = await response.json();
    renderMenu(menuData);
    // Fill Wi-Fi and social links
    document.getElementById("wifi-ssid").innerText = menuData.wifi.ssid;
    document.getElementById("wifi-password").innerText = menuData.wifi.password;
    document.getElementById("facebook-link").href = menuData.social.facebook;
    document.getElementById("googlemaps-link").href =
      menuData.social.googleMaps;
    document.getElementById("update-date").innerText =
      new Date().toLocaleDateString("fr-FR");
  } catch (err) {
    console.error("Menu loading error:", err);
    document.getElementById("menu-container").innerHTML =
      "<p>Unable to load menu. Please try again later.</p>";
  }
}

// Render all categories and items
function renderMenu(data) {
  const container = document.getElementById("menu-container");
  container.innerHTML = "";
  for (const cat of data.categories) {
    const catDiv = document.createElement("div");
    catDiv.className = "category";
    catDiv.innerHTML = `<h2>${cat.icon || ""} ${
      cat.name
    }</h2><div class="items-grid"></div>`;
    const grid = catDiv.querySelector(".items-grid");
    for (const item of cat.items) {
      const itemDiv = document.createElement("div");
      itemDiv.className = "menu-item";
      itemDiv.innerHTML = `
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          ${
            item.description
              ? `<div class="item-desc">${item.description}</div>`
              : ""
          }
        </div>
        <div class="item-price">${item.price.toFixed(2)} DT</div>
      `;
      grid.appendChild(itemDiv);
    }
    container.appendChild(catDiv);
  }
}

// Load the daily special from platdujour.json (with cache buster)
async function loadPlatDuJour() {
  try {
    const res = await fetch("data/platdujour.json?t=" + Date.now());
    const data = await res.json();
    const plat = data.plat;
    if (plat && plat.available) {
      document.getElementById("plat-name").innerText = plat.name;
      document.getElementById("plat-desc").innerText = plat.description || "";
      document.getElementById("plat-price").innerHTML = `${plat.price.toFixed(
        2
      )} DT`;
      document.getElementById("plat-available").innerHTML = "✅ Available";
      if (plat.image) {
        const img = document.getElementById("plat-image");
        img.src = `images/${plat.image}`;
        img.style.display = "block";
      } else {
        document.getElementById("plat-image").style.display = "none";
      }
    } else {
      document.getElementById("plat-name").innerText = "No daily special today";
      document.getElementById("plat-price").innerHTML = "";
      document.getElementById("plat-available").innerHTML =
        "❌ Sold out / Not available";
      document.getElementById("plat-image").style.display = "none";
    }
  } catch (err) {
    console.error("Daily special loading error:", err);
    document.getElementById("plat-name").innerText =
      "Daily special unavailable";
  }
}

// Initialize both loads
loadMenu();
loadPlatDuJour();
