alert("JS LOADED"); // remove after testing

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const waNumber = "919719200214";
  const baseWA = `https://wa.me/${waNumber}`;
  const baseMsg = `Hi Shalini, I'd like to order the following items:`;

  function waLinkFromCart(lines){
    const text = [baseMsg, "", ...lines, "", "Please confirm total and delivery/pickup time."].join("\n");
    return `${baseWA}?text=${encodeURIComponent(text)}`;
  }

  ["waHero","waOrder","waContact"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = waLinkFromCart([
      "- Stuffed Paranthas (2 pcs) x1",
      "- Shahi Paneer Combo x1"
    ]);
  });

  const cart = new Map();
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");
  const waCart = document.getElementById("waCart");

  function formatINR(n){ return `₹${n}`; }

  function renderCart(){
    if (!cartList || !cartTotal || !waCart) return;
    cartList.innerHTML = "";
    let total = 0;
    for (const [name, v] of cart.entries()){
      total += v.qty * v.price;
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span>${name}</span>
        <span class="qty">
          <button aria-label="decrease">−</button>
          <strong>${v.qty}</strong>
          <button aria-label="increase">+</button>
          <em>${formatINR(v.qty * v.price)}</em>
        </span>`;
      const [decBtn,,incBtn] = li.querySelectorAll("button");
      decBtn.addEventListener("click", () => updateQty(name, -1));
      incBtn.addEventListener("click", () => updateQty(name, +1));
      cartList.appendChild(li);
    }
    cartTotal.textContent = formatINR(total);
    const lines = Array.from(cart.entries()).map(([n,v])=>`- ${n} x${v.qty}`);
    waCart.href = waLinkFromCart(lines.length ? lines : ["- (no items selected)"]);
  }

  function updateQty(name, delta){
    const v = cart.get(name);
    if (!v) return;
    v.qty += delta;
    if (v.qty <= 0) cart.delete(name);
    renderCart();
  }

  document.querySelectorAll(".add").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price||0);
      const v = cart.get(name) || {qty:0, price};
      v.qty += 1;
      cart.set(name, v);
      renderCart();
    });
  });

  renderCart();
});
