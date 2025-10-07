document.addEventListener("DOMContentLoaded", () => {

  // Show current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Cart state
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
      li.innerHTML = `
        <span>${name}</span>
        <span>
          <button class="dec">−</button>
          <strong>${v.qty}</strong>
          <button class="inc">+</button>
          <em>${formatINR(v.qty * v.price)}</em>
        </span>`;
      const dec = li.querySelector(".dec");
      const inc = li.querySelector(".inc");
      dec.addEventListener("click",()=>update(name,-1));
      inc.addEventListener("click",()=>update(name,1));
      cartList.appendChild(li);
    }
    cartTotal.textContent = formatINR(total);
    const lines = Array.from(cart.entries()).map(([n,v])=>`- ${n} x${v.qty}`);
    waCart.href = `https://wa.me/919719200214?text=${encodeURIComponent(
      "Hi Shalini, I'd like to order:\n\n" + lines.join("\n")
    )}`;
  }

  function update(name,delta){
    const v = cart.get(name);
    if(!v) return;
    v.qty+=delta;
    if(v.qty<=0) cart.delete(name);
    renderCart();
  }

  document.querySelectorAll(".add").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const name=btn.dataset.name;
      const price=Number(btn.dataset.price);
      const v=cart.get(name)||{qty:0,price};
      v.qty++;
      cart.set(name,v);
      renderCart();
    });
  });

  renderCart();
});
