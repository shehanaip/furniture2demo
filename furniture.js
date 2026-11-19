const products = [
  {id:1,name:"Nerd wooden chair",image:"img/ref-furniture-01.webp",hoverImage:"img/ref-furniture-01-hover.webp",price:599,old:799,rating:4.0,brand:"Vitra",colors:["Black","Blue","Gray","Yellow"],badge:"-25%",description:"A sculptural wood frame and soft seat bring a little Scandinavian character to everyday dining."},
  {id:2,name:"Panton tunior chair",image:"img/ref-furniture-02.jpg",hoverImage:"img/ref-furniture-02-hover.jpg",price:199,rating:4.5,brand:"HAY",colors:["Black","Blue","Gray","Green"],badge:"New",description:"An iconic, playful silhouette with a comfortable seat and a fresh pop of color."},
  {id:3,name:"Wooden na\u00EFve chair",image:"img/ref-furniture-03.webp",hoverImage:"img/ref-furniture-03-hover.webp",price:119,rating:4.5,brand:"Alessi",colors:["Beige","Gray","Green"],description:"A rounded back and warm wooden legs bring a relaxed, organic feel to the dining room."},
  {id:4,name:"Eames lounge chair",image:"img/ref-furniture-04.webp",hoverImage:"img/ref-furniture-04-hover.webp",price:399,old:799,rating:4.5,brand:"Vitra",colors:["Black","Gray"],badge:"-50%",description:"A timeless lounge chair with a generous seat, rich upholstery and a beautifully sculpted frame."},
  {id:5,name:"Wooden single drawer",image:"img/ref-furniture-05.jpg",hoverImage:"img/ref-furniture-05-hover.webp",price:249,rating:4.5,brand:"Louis Poulsen",colors:["Blue","Brown","Yellow"],description:"A simple storage piece with clean lines, a handy drawer and carefully angled legs."},
  {id:6,name:"Eames Plastic Side Chair",image:"img/ref-furniture-06.jpg",hoverImage:"img/ref-furniture-06-hover.jpg",price:99,rating:5.0,brand:"Vitra",colors:["Beige","Black","Blue"],badge:"New",description:"A familiar modern profile made comfortable for the everyday, with a light, sturdy base."},
  {id:7,name:"Char with love",image:"img/ref-furniture-07.webp",hoverImage:"img/ref-furniture-07-hover.webp",price:420,rating:4.5,brand:"Magisso",colors:["Beige","Brown","Green"],description:"A softly curved accent chair that makes a welcoming place to pause and unwind."},
  {id:8,name:"Classic wooden chair",image:"img/ref-furniture-08.webp",hoverImage:"img/ref-furniture-08-hover.webp",price:5,old:19,rating:5.0,brand:"HAY",colors:["Black","Brown","Gray"],badge:"Sale",description:"A classic chair shape with a sturdy timber frame and a clean, easy-to-live-with finish."},
  {id:9,name:"Reflect Chest of Drawers",image:"img/ref-furniture-09.jpg",hoverImage:"img/ref-furniture-09-hover.jpg",price:399,rating:4.0,brand:"Eva Solo",colors:["Beige","Brown","Yellow"],description:"Quietly practical storage with a warm wood finish and a balanced, modern silhouette."},
  {id:10,name:"Char with Magazine",image:"img/ref-furniture-10.webp",hoverImage:"img/ref-furniture-10-hover.webp",price:249,rating:5.0,brand:"Vitra",colors:["Black","Blue","Green"],description:"An easygoing chair with a built-in place to keep your favorite book close at hand."},
  {id:11,name:"Euismod aliquam parturient",image:"img/ref-furniture-11.jpg",hoverImage:"img/ref-furniture-11-hover.jpg",price:599,rating:5.0,brand:"Joseph Joseph",colors:["Black","Gray","Green","Red"],description:"A fresh contemporary accent that combines generous proportions with thoughtful details."},
  {id:12,name:"Facilisis ligula aliquet",image:"img/ref-furniture-12.jpg",hoverImage:"img/ref-furniture-12-hover.jpg",price:199,rating:4.5,brand:"PackIt",colors:["Beige","Blue","Brown"],description:"A compact, versatile piece designed to make small spaces feel considered and calm."}
];
const extraFinishes = ["Natural Oak", "Warm Walnut", "Soft Grey"];
for (let i = 0; products.length < 33; i += 1) {
  const base = products[i % 12];
  products.push({ ...base, id: products.length + 1, name: `${base.name} - ${extraFinishes[Math.floor(i / 12)]}`, price: Math.max(49, base.price + (i % 3) * 35) });
}
const grid = document.querySelector("#product-grid");
const cart = new Map();
const toast = document.querySelector(".toast");
const revealSelector = ".reveal-section, .shop-sidebar, .promo-banner, .shop-toolbar, .pagination, .site-footer .footer-main, .site-footer .footer-menu, .category-product-card";
let currentPage = 1;
let pageSize = 12;
let minPrice = 0;
let maxPrice = 1000;
let toastTimer;
const filterState = { colors: new Set(), brands: new Set(), sizes: new Set(), sale: false, stock: false, query: "" };

function money(value) { return `$${value.toFixed(2)}`; }
function stars(rating) { return `${"★".repeat(Math.round(rating))}${"☆".repeat(5 - Math.round(rating))}`; }
function getFilteredProducts() {
  return products.filter((product) => {
    const searchMatch = `${product.name} ${product.brand}`.toLowerCase().includes(filterState.query);
    const colorMatch = !filterState.colors.size || [...filterState.colors].some((color) => product.colors.includes(color));
    const brandMatch = !filterState.brands.size || filterState.brands.has(product.brand);
    const sizeMatch = !filterState.sizes.size || (product.id % 4 === 0 && filterState.sizes.has("XL"));
    const saleMatch = !filterState.sale || Boolean(product.old);
    const stockMatch = !filterState.stock || product.id !== 8;
    return searchMatch && colorMatch && brandMatch && sizeMatch && saleMatch && stockMatch && product.price >= minPrice && product.price <= maxPrice;
  });
}
function drawCard(product, index) {
  const colorDots = product.colors.slice(0, 4).map((color) => `<i class="color-chip ${color.toLowerCase()}" title="${color}"></i>`).join("");
  return `<article class="category-product-card reveal-on-scroll" style="--reveal-delay:${(index % 4) * 75}ms" data-product-id="${product.id}">
    <div class="category-product-image">${product.id === 1 ? `<a class="product-image-link" href="product.html" aria-label="View ${product.name}">` : ""}<img class="product-main-image" src="${product.image}" alt="${product.name}" loading="lazy" /><img class="product-hover-image" src="${product.hoverImage || product.image}" alt="" loading="lazy" />${product.id === 1 ? "</a>" : ""}${product.badge ? `<span class="product-label ${product.old ? "sale-label" : ""}">${product.badge}</span>` : ""}<button class="product-compare" type="button" aria-label="Compare ${product.name}" data-compare="${product.id}">⇄</button><div class="product-quick-actions"><button type="button" data-add="${product.id}">Add to cart</button><button type="button" class="product-quick-view" aria-label="View ${product.name}" data-quick-view="${product.id}">⌕</button></div></div>
    <div class="product-card-info"><h2 class="product-card-title">${product.id === 1 ? `<a href="product.html">${product.name}</a>` : product.name}</h2><p class="product-card-category">Furniture</p><p class="product-card-rating" aria-label="Rated ${product.rating} out of 5">${stars(product.rating)}</p><div class="product-card-price">${product.old ? `<del>${money(product.old)}</del>` : ""}${money(product.price)}</div><div class="product-card-colors" aria-label="Available colors">${colorDots}</div></div>
  </article>`;
}
function updateRevealTargets() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(revealSelector).forEach((item) => item.classList.add("is-in-view"));
    return;
  }
  if (window.furnitureRevealObserver) window.furnitureRevealObserver.disconnect();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
  window.furnitureRevealObserver = observer;
  document.querySelectorAll(revealSelector).forEach((item) => {
    item.classList.add("reveal-on-scroll");
    observer.observe(item);
  });
}
function updateAppliedFilters() {
  const area = document.querySelector("#applied-filters");
  const chips = [];
  filterState.colors.forEach((value) => chips.push(["colors", value]));
  filterState.brands.forEach((value) => chips.push(["brands", value]));
  filterState.sizes.forEach((value) => chips.push(["sizes", value]));
  if (filterState.sale) chips.push(["sale", "On sale"]);
  if (filterState.stock) chips.push(["stock", "In stock"]);
  if (minPrice > 0 || maxPrice < 1000) chips.push(["price", `$${minPrice}–$${maxPrice}`]);
  area.hidden = chips.length === 0;
  area.innerHTML = chips.map(([type, label]) => `<button type="button" data-clear-filter="${type}" data-filter-value="${label}">${label}<span aria-hidden="true">×</span></button>`).join("");
}
function renderProducts(keepPage = false) {
  const sort = document.querySelector("#sort-products").value;
  let shown = getFilteredProducts();
  if (sort === "price-low") shown.sort((a,b) => a.price-b.price);
  if (sort === "price-high") shown.sort((a,b) => b.price-a.price);
  if (sort === "rating") shown.sort((a,b) => b.rating-a.rating);
  if (sort === "newest") shown.sort((a,b) => b.id-a.id);
  if (!keepPage) currentPage = 1;
  const total = shown.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageItems = shown.slice(start, start + pageSize);
  grid.innerHTML = pageItems.map(drawCard).join("");
  document.querySelector("#result-start").textContent = total ? String(start + 1) : "0";
  document.querySelector("#result-end").textContent = String(Math.min(start + pageItems.length, total));
  document.querySelector("#result-total").textContent = String(total);
  document.querySelector(".results-count").hidden = false;
  document.querySelector(".pagination").hidden = pageCount <= 1;
  document.querySelectorAll(".page-number").forEach((button) => {
    const page = Number(button.dataset.page);
    button.hidden = page > pageCount;
    button.classList.toggle("active", page === currentPage);
    if (page === currentPage) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  document.querySelector(".page-next").hidden = currentPage >= pageCount;
  updateAppliedFilters();
  updateRevealTargets();
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}
function updateCart() {
  const items = [...cart.values()];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach((element) => element.textContent = String(count));
  document.querySelector(".cart-total").textContent = money(total);
  document.querySelector(".drawer-count").textContent = `(${count})`;
  document.querySelector(".cart-items").innerHTML = items.map(({product,quantity}) => `<div class="cart-line"><img src="${product.image}" alt="${product.name}"/><div><h3>${product.name}</h3><p>${money(product.price)}</p><div class="quantity-control"><button data-qty="${product.id}" data-step="-1" aria-label="Decrease quantity">−</button><span>${quantity}</span><button data-qty="${product.id}" data-step="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${product.id}" type="button">Remove</button></div>`).join("");
  document.querySelector(".cart-empty").hidden = items.length > 0;
  document.querySelector(".cart-summary").hidden = items.length === 0;
  document.querySelector(".subtotal-row strong").textContent = money(total);
}
function closeCart() {
  document.querySelector(".cart-drawer").classList.remove("open");
  document.querySelector(".drawer-backdrop").classList.remove("visible");
  document.querySelector(".cart-drawer").setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  setTimeout(() => document.querySelector(".drawer-backdrop").hidden = true, 260);
}
function openCart() {
  updateCart();
  const backdrop = document.querySelector(".drawer-backdrop");
  backdrop.hidden = false;
  requestAnimationFrame(() => { backdrop.classList.add("visible"); document.querySelector(".cart-drawer").classList.add("open"); });
  document.querySelector(".cart-drawer").setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

const backdrop = document.createElement("div");
backdrop.className = "shop-backdrop";
backdrop.setAttribute("aria-hidden", "true");
document.body.append(backdrop);

document.querySelector("#product-grid").addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const remove = event.target.closest("[data-remove]");
  const quantity = event.target.closest("[data-qty]");
  const compare = event.target.closest("[data-compare]");
  const quickView = event.target.closest("[data-quick-view]");
  if (add) {
    const product = products.find((item) => item.id === Number(add.dataset.add));
    const item = cart.get(product.id) || { product, quantity: 0 };
    item.quantity += 1; cart.set(product.id, item); updateCart(); showToast(`${product.name} added to your bag`);
  }
  if (compare) showToast("Added to compare");
  if (quickView) {
    const product = products.find((item) => item.id === Number(quickView.dataset.quickView));
    showToast(`${product.name} — ${money(product.price)}`);
  }
  if (remove) { cart.delete(Number(remove.dataset.remove)); updateCart(); }
  if (quantity) {
    const id = Number(quantity.dataset.qty); const item = cart.get(id); item.quantity += Number(quantity.dataset.step);
    if (item.quantity <= 0) cart.delete(id); else cart.set(id,item);
    updateCart();
  }
});
document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
document.querySelector(".checkout-button").addEventListener("click", () => showToast("Checkout is coming soon"));
document.querySelector(".drawer-backdrop").addEventListener("click", closeCart);
document.querySelector(".cart-items").addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]"); const quantity = event.target.closest("[data-qty]");
  if (remove) { cart.delete(Number(remove.dataset.remove)); updateCart(); }
  if (quantity) { const id=Number(quantity.dataset.qty); const item=cart.get(id); item.quantity+=Number(quantity.dataset.step); if(item.quantity<=0) cart.delete(id); else cart.set(id,item); updateCart(); }
});
document.querySelector(".header-search-form").addEventListener("submit", (event) => {
  event.preventDefault(); filterState.query = document.querySelector(".header-search-form input[type=search]").value.trim().toLowerCase(); renderProducts(); document.querySelector("#furniture-shop").scrollIntoView({behavior:"smooth"});
});
document.querySelector(".header-search-form input[type=search]").addEventListener("input", (event) => { filterState.query=event.target.value.trim().toLowerCase(); renderProducts(); });
document.querySelector("#sort-products").addEventListener("change", () => renderProducts(true));
document.querySelectorAll(".page-size-option").forEach((button)=>button.addEventListener("click",()=>{pageSize=Number(button.dataset.size);document.querySelectorAll(".page-size-option").forEach((item)=>item.classList.toggle("active",item===button));renderProducts();}));
document.querySelectorAll(".filter-options").forEach((group) => group.addEventListener("change", (event) => {
  const input = event.target.closest("input[type=checkbox]"); if (!input) return;
  if (input.name === "color") input.checked ? filterState.colors.add(input.value) : filterState.colors.delete(input.value);
  if (input.name === "brand") input.checked ? filterState.brands.add(input.value) : filterState.brands.delete(input.value);
  if (input.name === "size") input.checked ? filterState.sizes.add(input.value) : filterState.sizes.delete(input.value);
  if (input.id === "on-sale") filterState.sale = input.checked;
  if (input.id === "in-stock") filterState.stock = input.checked;
  renderProducts();
}));
document.querySelector("#apply-price").addEventListener("click", () => {
  minPrice=Math.max(0,Number(document.querySelector("#min-price").value)||0);
  maxPrice=Number(document.querySelector("#max-price").value)||1000;
  document.querySelector("#price-summary").textContent=`$${minPrice} – $${maxPrice}`;
  renderProducts();
});
document.querySelector("#brand-search").addEventListener("input", (event) => {
  const query=event.target.value.toLowerCase();
  document.querySelectorAll(".brand-options label").forEach((row) => row.hidden=!row.textContent.toLowerCase().includes(query));
});
document.querySelector("#applied-filters").addEventListener("click", (event) => {
  const chip=event.target.closest("[data-clear-filter]"); if(!chip) return;
  const {clearFilter:type,filterValue:value}=chip.dataset;
  if(type==="colors") { filterState.colors.delete(value); document.querySelectorAll('[name="color"]').forEach((i)=>{if(i.value===value)i.checked=false;}); }
  if(type==="brands") { filterState.brands.delete(value); document.querySelectorAll('[name="brand"]').forEach((i)=>{if(i.value===value)i.checked=false;}); }
  if(type==="sizes") { filterState.sizes.delete(value); document.querySelectorAll('[name="size"]').forEach((i)=>{if(i.value===value)i.checked=false;}); }
  if(type==="sale") {filterState.sale=false;document.querySelector("#on-sale").checked=false;}
  if(type==="stock") {filterState.stock=false;document.querySelector("#in-stock").checked=false;}
  if(type==="price") {minPrice=0;maxPrice=1000;document.querySelector("#min-price").value="";document.querySelector("#max-price").value="";document.querySelector("#price-summary").textContent="$0 – $1,000";}
  renderProducts();
});
document.querySelector(".pagination").addEventListener("click", (event) => {
  const button=event.target.closest("[data-page]"); if(!button) return;
  currentPage=Number(button.dataset.page); renderProducts(true); document.querySelector("#furniture-shop").scrollIntoView({behavior:"smooth",block:"start"});
});
document.querySelectorAll(".view-mode").forEach((button)=>button.addEventListener("click",()=>{
  document.querySelectorAll(".view-mode").forEach((item)=>item.classList.toggle("active",item===button));
  const listView=button.dataset.view==="list"; grid.classList.toggle("list-view",listView);
  if(button.dataset.columns) grid.style.setProperty("--grid-columns",button.dataset.columns);
}));
document.querySelector(".filter-toggle").addEventListener("click",()=>{
  document.querySelector(".shop-sidebar").classList.add("is-open"); backdrop.classList.add("is-visible"); document.querySelector(".filter-toggle").setAttribute("aria-expanded","true");
});
function closeFilters(){document.querySelector(".shop-sidebar").classList.remove("is-open");backdrop.classList.remove("is-visible");document.querySelector(".filter-toggle").setAttribute("aria-expanded","false");}
document.querySelector(".filter-close").addEventListener("click",closeFilters);
backdrop.addEventListener("click",closeFilters);
document.querySelector(".mobile-menu-button").addEventListener("click",(event)=>{
  const nav=document.querySelector(".main-nav"); const open=nav.classList.toggle("open"); event.currentTarget.setAttribute("aria-expanded",String(open));
});
document.querySelector(".back-to-top").addEventListener("click",()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
function updateBackToTop(){const button=document.querySelector(".back-to-top");const visible=window.scrollY>320;button.classList.toggle("is-visible",visible);button.setAttribute("aria-hidden",String(!visible));button.tabIndex=visible?0:-1;}
window.addEventListener("scroll",updateBackToTop,{passive:true});
document.addEventListener("keydown",(event)=>{if(event.key==="Escape"){closeCart();closeFilters();}});
updateCart();
renderProducts();
updateRevealTargets();
updateBackToTop();
const categoryMenu = document.querySelector(".category-menu");
const categoryMenuToggle = categoryMenu.querySelector(".category-menu-toggle");
const canHoverCategories = window.matchMedia("(hover: hover) and (min-width: 651px)");
function setCategoryMenuOpen(open) {
  categoryMenu.classList.toggle("is-open", open);
  categoryMenuToggle.setAttribute("aria-expanded", String(open));
}
categoryMenu.addEventListener("pointerenter", () => { if (canHoverCategories.matches) setCategoryMenuOpen(true); });
categoryMenu.addEventListener("pointerleave", () => {
  if (canHoverCategories.matches && !categoryMenu.contains(document.activeElement)) setCategoryMenuOpen(false);
});
categoryMenu.addEventListener("focusin", () => setCategoryMenuOpen(true));
categoryMenu.addEventListener("focusout", () => setTimeout(() => {
  if (!categoryMenu.contains(document.activeElement)) setCategoryMenuOpen(false);
}, 0));
categoryMenuToggle.addEventListener("click", () => {
  if (!canHoverCategories.matches) {
    const shouldOpen = !categoryMenu.classList.contains("is-open");
    setCategoryMenuOpen(shouldOpen);
    if (!shouldOpen) categoryMenuToggle.blur();
  }
  else setCategoryMenuOpen(true);
});
document.addEventListener("click", (event) => {
  if (!categoryMenu.contains(event.target)) setCategoryMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && categoryMenu.classList.contains("is-open")) {
    setCategoryMenuOpen(false);
    categoryMenuToggle.blur();
  }
});
