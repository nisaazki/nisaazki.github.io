
// Simple Journal Store frontend (no backend). Cart stored in localStorage for demo.
// Data
const items = [
  {id:1,title:'Dotted Dream',price:119000,type:'dotted',color:'cream',img:'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop',desc:'Kertas 120 gsm, ideal bullet journal.'},
  {id:2,title:'Lined Light',price:99000,type:'lined',color:'white',img:'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=1200&auto=format&fit=crop',desc:'Garis tipis, nyaman menulis.'},
  {id:3,title:'Grid Guide',price:129000,type:'grid',color:'cream',img:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1200&auto=format&fit=crop',desc:'Grid 5mm, cocok sketsa.'},
  {id:4,title:'Leather Luxe',price:199000,type:'leather',color:'brown',img:'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',desc:'Cover kulit, premium look.'},
  {id:5,title:'Dotted Milk',price:109000,type:'dotted',color:'white',img:'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop',desc:'Halus, tinta cepat kering.'},
  {id:6,title:'Lined Classic',price:99000,type:'lined',color:'cream',img:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',desc:'Klasik dengan kertas tebal.'}
];

// Elements
const catalogGrid = document.getElementById('catalogGrid');
const bestGrid = document.getElementById('bestGrid');
const productTpl = document.getElementById('productTpl');
const filterChips = document.querySelectorAll('.chip');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const closeCart = document.getElementById('closeCart');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

// Cart state
let cart = JSON.parse(localStorage.getItem('journal_cart') || '[]');

function saveCart(){ localStorage.setItem('journal_cart', JSON.stringify(cart)); updateCartUI(); }

function formatRupiah(n){ return 'Rp ' + n.toLocaleString('id-ID'); }

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML = '';
  let subtotal = 0;
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p class="muted">Keranjang kosong</p>';
  } else {
    cart.forEach(ci => {
      subtotal += ci.qty * ci.price;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${ci.img}" alt="${ci.title}">
        <div class="meta">
          <div style="font-weight:700">${ci.title}</div>
          <div class="muted">${ci.qty} × ${formatRupiah(ci.price)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:800">${formatRupiah(ci.qty*ci.price)}</div>
          <button class="btn outline small remove" data-id="${ci.id}">Hapus</button>
        </div>`;
      cartItemsEl.appendChild(el);
    });
  }
  subtotalEl.textContent = formatRupiah(subtotal);
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

// Add to cart
function addToCart(item){
  const exists = cart.find(c=>c.id===item.id);
  if(exists){ exists.qty += 1; }
  else { cart.push({...item, qty:1}); }
  saveCart();
  pulse(cartBtn);
}

// Remove from cart
cartItemsEl.addEventListener('click', (e)=>{
  if(e.target.classList.contains('remove')){
    const id = Number(e.target.dataset.id);
    cart = cart.filter(c=>c.id!==id);
    saveCart();
  }
});

// Clear cart
clearCartBtn.addEventListener('click', ()=>{ cart=[]; saveCart(); });

// Open/close cart
cartBtn.addEventListener('click', ()=>{ cartDrawer.classList.toggle('open'); });
closeCart.addEventListener('click', ()=> cartDrawer.classList.remove('open'));

// Checkout
checkoutBtn.addEventListener('click', ()=>{
  if(cart.length===0){ alert('Keranjang kosong.'); return; }
  if(typeof checkoutModal.showModal === 'function') checkoutModal.showModal(); else checkoutModal.style.display='block';
});

document.getElementById('checkoutForm')?.addEventListener('submit', (e)=>{
  e.preventDefault?.();
  // Simulate order
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const phone = document.getElementById('phone').value;
  if(!name||!address||!phone){ alert('Lengkapi data checkout.'); return; }
  const order = {id:Date.now(), name, address, phone, items:cart, total: cart.reduce((s,i)=>s+i.qty*i.price,0)};
  console.log('Order placed', order);
  // clear cart and close modal
  cart = []; saveCart();
  if(typeof checkoutModal.close === 'function') checkoutModal.close(); else checkoutModal.style.display='none';
  alert('Terima kasih! Pesanan mu sudah diterima. (Demo)');
});

document.getElementById('cancelCheckout')?.addEventListener('click', ()=>{
  if(typeof checkoutModal.close === 'function') checkoutModal.close(); else checkoutModal.style.display='none';
});

// Pulse animation
function pulse(el){
  el.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}], {duration:260,easing:'ease-out'});
}

// Render products
function renderCatalog(filter='all', term=''){
  catalogGrid.innerHTML='';
  items.filter(it=> filter==='all' || it.type===filter )
       .filter(it=> it.title.toLowerCase().includes(term) || it.type.includes(term) || it.color.includes(term))
       .forEach(it=>{
    const node = productTpl.content.cloneNode(true);
    node.querySelector('.pimg').src = it.img;
    node.querySelector('.pimg').alt = it.title;
    node.querySelector('.title').textContent = it.title;
    node.querySelector('.meta').textContent = it.type + ' · ' + it.color;
    node.querySelector('.price').textContent = formatRupiah(it.price);
    node.querySelector('.btn.add').addEventListener('click', ()=> addToCart(it));
    node.querySelector('.quick').addEventListener('click', ()=> openQuickView(it));
    catalogGrid.appendChild(node);
  });
}

// Render best sellers (first three)
function renderBest(){
  bestGrid.innerHTML='';
  items.slice(0,3).forEach(it=>{
    const c = document.createElement('div');
    c.className = 'best-card';
    c.innerHTML = `<img src="${it.img}" alt="${it.title}"><div class="info"><div style="font-weight:800">${it.title}</div><div class="muted">${it.type}</div><div class="price">${formatRupiah(it.price)}</div><button class="btn add">Tambah</button></div>`;
    c.querySelector('.btn.add').addEventListener('click', ()=> addToCart(it));
    bestGrid.appendChild(c);
  });
}

// Filters
filterChips.forEach(chip=> chip.addEventListener('click', ()=>{
  filterChips.forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  renderCatalog(chip.dataset.filter, (searchInput.value||'').toLowerCase());
}));

// Search
searchBtn?.addEventListener('click', ()=> renderCatalog('all', (searchInput.value||'').toLowerCase()));
searchInput?.addEventListener('keydown', (e)=> { if(e.key==='Enter') renderCatalog('all', (searchInput.value||'').toLowerCase()); });

// Quick view modal (simple alert replaced with dialog preferred)
function openQuickView(it){
  const html = `Produk: ${it.title}\nHarga: ${formatRupiah(it.price)}\nDeskripsi: ${it.desc}`;
  alert(html);
}

// Slider logic
(function slider(){
  const slider = document.getElementById('mainSlider');
  const slides = slider.querySelector('.slides');
  const total = slides.children.length;
  const dots = document.getElementById('sliderDots');
  let idx = 0;
  // create dots
  for(let i=0;i<total;i++){
    const b = document.createElement('button');
    b.dataset.i = i;
    if(i===0) b.classList.add('active');
    b.addEventListener('click', ()=> goTo(i));
    dots.appendChild(b);
  }
  function goTo(i){
    idx = i;
    slides.style.transform = `translateX(-${i*100}%)`;
    Array.from(dots.children).forEach((d,ii)=> d.classList.toggle('active', ii===i));
  }
  slider.querySelector('.prev').addEventListener('click', ()=> goTo((idx-1+total)%total));
  slider.querySelector('.next').addEventListener('click', ()=> goTo((idx+1)%total));
  let auto = setInterval(()=> goTo((idx+1)%total), 4500);
  slider.addEventListener('mouseenter', ()=> clearInterval(auto));
  slider.addEventListener('mouseleave', ()=> auto = setInterval(()=> goTo((idx+1)%total), 4500));
})();

// Init
renderCatalog();
renderBest();
updateCartUI();
