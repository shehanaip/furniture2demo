const productImages = [...document.querySelectorAll(".gallery-thumb")];
const mainProductImage = document.querySelector("#gallery-main-image");
function selectProductImage(button) {
  mainProductImage.style.opacity = "0.35";
  setTimeout(() => {
    mainProductImage.src = button.dataset.image;
    mainProductImage.alt = button.dataset.alt;
    mainProductImage.style.opacity = "1";
  }, 120);
  productImages.forEach((thumb) => {
    const selected = thumb === button;
    thumb.classList.toggle("is-selected", selected);
    thumb.setAttribute("aria-pressed", String(selected));
  });
}
productImages.forEach((button) => button.addEventListener("click", () => selectProductImage(button)));

const colorChoices = [...document.querySelectorAll(".detail-swatch")];
const colorLabel = document.querySelector(".selected-color-name");
function chooseColor(button) {
  colorChoices.forEach((choice) => {
    const selected = choice === button;
    choice.classList.toggle("is-selected", selected);
    choice.setAttribute("aria-pressed", String(selected));
  });
  colorLabel.textContent = button.dataset.color;
  const matchingThumb = productImages.find((thumb) => thumb.dataset.image === button.dataset.image);
  if (matchingThumb) selectProductImage(matchingThumb);
  else {
    mainProductImage.src = button.dataset.image;
    mainProductImage.alt = `Nerd wooden chair in ${button.dataset.color.toLowerCase()}`;
    productImages.forEach((thumb) => { thumb.classList.remove("is-selected"); thumb.setAttribute("aria-pressed", "false"); });
  }
}
colorChoices.forEach((button) => button.addEventListener("click", () => chooseColor(button)));
document.querySelector(".clear-variation").addEventListener("click", () => chooseColor(document.querySelector('[data-color="Gray"]')));

const quantityOutput = document.querySelector("#product-quantity");
document.querySelectorAll("[data-quantity-step]").forEach((button) => button.addEventListener("click", () => {
  quantityOutput.value = String(Math.max(1, Number(quantityOutput.value || quantityOutput.textContent) + Number(button.dataset.quantityStep)));
  quantityOutput.textContent = quantityOutput.value;
}));

const toast = document.querySelector(".toast");
let toastTimer;
function announce(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}
const productCart = { count: 0, total: 0, quantity: 0 };
function refreshCart() {
  document.querySelectorAll(".cart-count").forEach((node) => node.textContent = String(productCart.count));
  document.querySelector(".cart-total").textContent = `$${productCart.total.toFixed(2)}`;
  document.querySelector(".drawer-count").textContent = `(${productCart.count})`;
  document.querySelector(".subtotal-row strong").textContent = `$${productCart.total.toFixed(2)}`;
  document.querySelector(".cart-empty").hidden = productCart.count > 0;
  document.querySelector(".cart-summary").hidden = productCart.count === 0;
  document.querySelector(".cart-items").innerHTML = productCart.count ? `<div class="cart-line"><img src="${mainProductImage.src}" alt="Nerd wooden chair"/><div><h3>Nerd wooden chair</h3><p>$599.00</p><div class="quantity-control"><button type="button" data-cart-step="-1" aria-label="Decrease quantity">−</button><span>${productCart.count}</span><button type="button" data-cart-step="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" type="button" data-cart-remove>Remove</button></div>` : "";
}
function openCart() {
  const backdrop = document.querySelector(".drawer-backdrop");
  backdrop.hidden = false;
  refreshCart();
  requestAnimationFrame(() => { backdrop.classList.add("visible"); document.querySelector(".cart-drawer").classList.add("open"); });
  document.querySelector(".cart-drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.querySelector(".cart-drawer").classList.remove("open");
  document.querySelector(".drawer-backdrop").classList.remove("visible");
  document.querySelector(".drawer-backdrop").hidden = true;
  document.querySelector(".cart-drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.querySelector(".detail-add-to-cart").addEventListener("click", () => {
  const quantity = Math.max(1, Number(quantityOutput.value || quantityOutput.textContent));
  productCart.count += quantity;
  productCart.quantity += quantity;
  productCart.total = productCart.count * 599;
  refreshCart();
  announce(`Nerd wooden chair added to your bag`);
});
document.querySelector(".cart-toggle").addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
document.querySelector(".drawer-backdrop").addEventListener("click", closeCart);
document.querySelector(".checkout-button").addEventListener("click", () => announce("Checkout is coming soon"));
document.querySelector(".cart-items").addEventListener("click", (event) => {
  if (event.target.closest("[data-cart-remove]")) { productCart.count = 0; productCart.total = 0; }
  const step = event.target.closest("[data-cart-step]");
  if (step) { productCart.count = Math.max(0, productCart.count + Number(step.dataset.cartStep)); productCart.total = productCart.count * 599; }
  refreshCart();
});
document.querySelector(".detail-icon-action").addEventListener("click", (event) => {
  const selected = event.currentTarget.classList.toggle("is-selected");
  event.currentTarget.querySelector(".wishlist-symbol").textContent = selected ? "♥" : "♡";
  announce(selected ? "Saved to your wishlist" : "Removed from your wishlist");
});
document.querySelector(".detail-compare-action").addEventListener("click", () => announce("Added to compare"));

document.querySelector(".gallery-zoom").addEventListener("click", () => {
  const overlay = document.querySelector(".product-image-lightbox");
  overlay.querySelector("img").src = mainProductImage.src;
  overlay.querySelector("img").alt = mainProductImage.alt;
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});
const lightbox = document.querySelector(".product-image-lightbox");
function closeLightbox() { lightbox.classList.remove("is-open"); lightbox.setAttribute("aria-hidden", "true"); if (!document.querySelector(".cart-drawer").classList.contains("open")) document.body.style.overflow = ""; }
lightbox.addEventListener("click", (event) => { if (event.target === lightbox || event.target.closest("button")) closeLightbox(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeLightbox(); closeCart(); } });

document.querySelector(".review-form").addEventListener("submit", (event) => { event.preventDefault(); announce("Thanks for sharing your review"); event.currentTarget.reset(); });
document.querySelector("[data-clear-reviews]").addEventListener("click", () => {
  document.querySelector(".review-list-toolbar input[type=checkbox]").checked = false;
  document.querySelector(".review-list-toolbar select").selectedIndex = 0;
  document.querySelectorAll(".customer-review").forEach((review) => { review.hidden = false; });
});
document.querySelector(".header-search-form").addEventListener("submit", (event) => { event.preventDefault(); window.location.href = `furniture.html?search=${encodeURIComponent(event.currentTarget.querySelector('input[type="search"]').value)}`; });
document.querySelector(".mobile-menu-button").addEventListener("click", (event) => {
  const nav = document.querySelector(".main-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

const categoryMenu = document.querySelector(".category-menu");
const categoryMenuToggle = categoryMenu.querySelector(".category-menu-toggle");
const canHoverCategories = window.matchMedia("(hover: hover) and (min-width: 651px)");
function setCategoryMenuOpen(open) { categoryMenu.classList.toggle("is-open", open); categoryMenuToggle.setAttribute("aria-expanded", String(open)); }
categoryMenu.addEventListener("pointerenter", () => { if (canHoverCategories.matches) setCategoryMenuOpen(true); });
categoryMenu.addEventListener("pointerleave", () => { if (canHoverCategories.matches && !categoryMenu.contains(document.activeElement)) setCategoryMenuOpen(false); });
categoryMenu.addEventListener("focusin", () => setCategoryMenuOpen(true));
categoryMenu.addEventListener("focusout", () => setTimeout(() => { if (!categoryMenu.contains(document.activeElement)) setCategoryMenuOpen(false); }, 0));
categoryMenuToggle.addEventListener("click", () => {
  if (!canHoverCategories.matches) { const open = !categoryMenu.classList.contains("is-open"); setCategoryMenuOpen(open); if (!open) categoryMenuToggle.blur(); }
  else setCategoryMenuOpen(true);
});
document.addEventListener("click", (event) => { if (!categoryMenu.contains(event.target)) setCategoryMenuOpen(false); });
document.querySelector(".back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
function updateBackToTop() { const button = document.querySelector(".back-to-top"); const visible = window.scrollY > 320; button.classList.toggle("is-visible", visible); button.setAttribute("aria-hidden", String(!visible)); button.tabIndex = visible ? 0 : -1; }
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

const revealTargets = document.querySelectorAll("[data-reveal]");
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle("is-revealed", entry.isIntersecting)), { threshold: .1, rootMargin: "0px 0px -5% 0px" });
  revealTargets.forEach((target) => { target.classList.add("product-reveal"); observer.observe(target); });
} else revealTargets.forEach((target) => target.classList.add("is-revealed"));

const sectionLinks = [...document.querySelectorAll(".product-detail-tabs a")];
const detailSections = sectionLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const tabObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) sectionLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${entry.target.id}`));
  }), { rootMargin: "-20% 0px -70% 0px" });
  detailSections.forEach((section) => tabObserver.observe(section));
}
refreshCart();
