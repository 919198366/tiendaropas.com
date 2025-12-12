/* ====== DATA: productos de ejemplo ====== */
const PRODUCTS = [
  {id:1,name:"Polera Oversize",price:49.9,cat:"Mujer",img:"img/p1.jpg",sizes:["S","M","L"]},
  {id:2,name:"Casaca Negra",price:89.9,cat:"Hombre",img:"img/p2.jpg",sizes:["M","L","XL"]},
  {id:3,name:"Vestido Floral",price:69.5,cat:"Mujer",img:"img/p3.jpg",sizes:["S","M","L"]},
  {id:4,name:"Jeans Clásicos",price:79.0,cat:"Hombre",img:"img/p4.jpg",sizes:["M","L","XL"]},
  {id:5,name:"Blusa Elegante",price:39.9,cat:"Mujer",img:"img/p5.jpg",sizes:["S","M"]},
  {id:6,name:"Gorra Street",price:19.9,cat:"Accesorios",img:"img/p6.jpg",sizes:[]},
  {id:7,name:"Zapatos Running",price:99.0,cat:"Hombre",img:"img/p7.jpg",sizes:["40","41","42"]},
  {id:8,name:"Bolso de Cuero",price:120.0,cat:"Mujer",img:"img/p8.jpg",sizes:[]},
  {id:9,name:"Short Veraniego",price:29.9,cat:"Mujer",img:"img/p9.jpg",sizes:["S","M","L"]},
  {id:10,name:"Sudadera Con Capucha",price:59.9,cat:"Hombre",img:"img/p10.jpg",sizes:["M","L","XL"]},
  {id:11,name:"Cinturón Piel",price:25.0,cat:"Accesorios",img:"img/p11.jpg",sizes:[]},
  {id:12,name:"Camisa Formal",price:45.0,cat:"Hombre",img:"img/p12.jpg",sizes:["M","L"]}
];

/* ====== SIDEBAR CONTROL ====== */
const sidebar = () => document.getElementById('sidebar');
const overlay = () => document.getElementById('overlay');
const openSidebar = () => {
  const s = sidebar(); if(!s) return;
  s.classList.add('active'); overlay().classList.add('show');
};
const closeSidebar = () => { const s=sidebar(); if(!s) return; s.classList.remove('active'); overlay().classList.remove('show'); };

document.addEventListener('click', (e) => {
  if(e.target && e.target.id === 'btnMenu') openSidebar();
  if(e.target && e.target.id === 'closeMenu') closeSidebar();
  if(e.target && e.target.id === 'overlay') closeSidebar();
});

/* ====== CART (localStorage) ====== */
function saveCart(cart){ localStorage.setItem('hm_cart', JSON.stringify(cart)); updateCartCounts(); }
function loadCart(){ return JSON.parse(localStorage.getItem('hm_cart')||'[]'); }
function updateCartCounts(){
  const c = loadCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count').forEach(el=>el.textContent=c);
}

/* ====== RENDERS ====== */
function elq(selector){ return document.querySelector(selector); }
function elqa(selector){ return Array.from(document.querySelectorAll(selector)); }

/* Render destacados en index */
function renderFeatured(){
  const target = elq('#featured');
  if(!target) return;
  target.innerHTML = '';
  const featured = PRODUCTS.slice(0,6);
  featured.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<img src="${p.img}" alt="${p.name}"><div class="card-body"><div class="card-title">${p.name}</div><div class="price">S/ ${p.price.toFixed(2)}</div><div style="margin-top:8px"><a href="detalle.html?id=${p.id}" class="btn">Ver</a></div></div>`;
    target.appendChild(card);
  });
}

/* Render grid en productos.html */
function renderProductsPage(){
  const container = elq('#productsGrid');
  if(!container) return;
  // get params (category)
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') || '';
  const filterSelect = elq('#filterCat');
  // fill categories
  const cats = [...new Set(PRODUCTS.map(p=>p.cat))];
  filterSelect.innerHTML = `<option value="">Todas las categorías</option>` + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
  if(cat) filterSelect.value = cat;

  // initial render
  const doRender = (q='',category='',sort='default')=>{
    let arr = PRODUCTS.slice();
    if(category) arr = arr.filter(x=>x.cat.toLowerCase()===category.toLowerCase());
    if(q) arr = arr.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()));
    if(sort==='price-asc') arr = arr.sort((a,b)=>a.price-b.price);
    if(sort==='price-desc') arr = arr.sort((a,b)=>b.price-a.price);
    container.innerHTML = '';
    arr.forEach(p=>{
      const col = document.createElement('div'); col.className='card';
      col.innerHTML = `<img src="${p.img}" alt="${p.name}"><div class="card-body"><div class="card-title">${p.name}</div><div class="price">S/ ${p.price.toFixed(2)}</div><div style="margin-top:8px"><a class="btn" href="detalle.html?id=${p.id}">Ver</a> <button class="btn add" data-id="${p.id}">Agregar</button></div></div>`;
      container.appendChild(col);
    });
    // bind add
    container.querySelectorAll('.add').forEach(b=>b.addEventListener('click',()=>{
      addToCart(parseInt(b.dataset.id));
    }));
  };

  // UI bindings
  const search = elq('#search'); const clear = elq('#clear'); const sort = elq('#sort');
  doRender('', cat, 'default');
  search && search.addEventListener('input', ()=> doRender(search.value, filterSelect.value, sort.value));
  clear && clear.addEventListener('click', ()=>{ if(search) search.value=''; doRender('',filterSelect.value, sort.value) });
  filterSelect && filterSelect.addEventListener('change', ()=> doRender(search?search.value:'', filterSelect.value, sort.value));
  sort && sort.addEventListener('change', ()=> doRender(search?search.value:'', filterSelect.value, sort.value));
}

/* Render detalle.html */
function renderDetailPage(){
  const area = elq('#detailArea'); if(!area) return;
  const params = new URLSearchParams(location.search); const id = parseInt(params.get('id'));
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ area.innerHTML='<p>Producto no encontrado</p>'; return;}
  area.innerHTML = `
    <div class="detail-grid">
      <div>
        <img class="detail-image" src="${p.img}" alt="${p.name}">
      </div>
      <div>
        <h2>${p.name}</h2>
        <div class="price">S/ ${p.price.toFixed(2)}</div>
        <p class="muted">Descripción breve: diseño moderno y tejido de calidad.</p>
        <div>
          <small>Tallas</small>
          <div id="sizes" class="size-list"></div>
        </div>
        <div style="margin-top:12px">
          <button id="btnAdd" class="btn">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `;
  // sizes
  const sizesWrap = elq('#sizes');
  if(p.sizes && p.sizes.length){
    p.sizes.forEach(s=>{
      const b = document.createElement('button'); b.className='size-btn'; b.textContent=s;
      b.addEventListener('click', ()=> { document.querySelectorAll('.size-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); });
      sizesWrap.appendChild(b);
    });
  } else { sizesWrap.innerHTML = '<small class="muted">Sin tallas</small>'; }
  elq('#btnAdd').addEventListener('click', ()=>{
    const sel = document.querySelector('.size-btn.active');
    const size = sel?sel.textContent:'';
    addToCart(p.id, size);
  });
}

/* Render carrito */
function renderCartPage(){
  const area = elq('#cartArea'); if(!area) return;
  const cart = loadCart();
  if(cart.length===0){ area.innerHTML = '<p>Tu carrito está vacío</p>'; return; }
  let html='';
  cart.forEach((it,idx)=>{
    const prod = PRODUCTS.find(p=>p.id===it.id);
    html += `<div class="cart-item">
      <img src="${prod.img}" style="width:90px;height:90px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <div class="card-title">${prod.name} ${it.size?(' - '+it.size):''}</div>
        <div class="muted">S/ ${prod.price.toFixed(2)} x ${it.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <div>
          <button class="qty-btn" data-idx="${idx}" data-op="minus">-</button>
          <span style="margin:0 8px">${it.qty}</span>
          <button class="qty-btn" data-idx="${idx}" data-op="plus">+</button>
        </div>
        <button class="btn" data-idx="${idx}" data-op="remove">Eliminar</button>
      </div>
    </div>`;
  });
  // total
  const total = cart.reduce((s,i)=>{
    const p = PRODUCTS.find(x=>x.id===i.id); return s + (p.price * i.qty);
  },0);
  html += `<div class="total-row"><div>Total</div><div>S/ ${total.toFixed(2)}</div></div>`;
  area.innerHTML = html;

  // bind qty & remove
  area.querySelectorAll('.qty-btn').forEach(b=>b.addEventListener('click', ()=>{
    const idx = parseInt(b.dataset.idx); const op = b.dataset.op;
    const c = loadCart();
    if(op==='plus') c[idx].qty +=1; if(op==='minus'){ if(c[idx].qty>1) c[idx].qty -=1; else c.splice(idx,1); }
    saveCart(c); renderCartPage();
  }));
  area.querySelectorAll('button[data-op="remove"]').forEach(b=>b.addEventListener('click', ()=>{
    const idx = parseInt(b.dataset.idx); const c = loadCart(); c.splice(idx,1); saveCart(c); renderCartPage();
  }));
}

/* Add to cart helper */
function addToCart(id, size=''){
  const cart = loadCart();
  const found = cart.find(i=>i.id===id && i.size===size);
  if(found) found.qty +=1; else cart.push({id,qty:1,size});
  saveCart(cart);
  alert('Producto agregado al carrito');
}

/* INITIALIZATION: call appropriate render based on current page */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCounts();
  renderFeatured(); // safe even if #featured not found
  renderProductsPage();
  renderDetailPage();
  renderCartPage();

  // menu buttons (some pages have duplicates so attach safely)
  const btn = document.getElementById('btnMenu'); if(btn) btn.addEventListener('click', openSidebar);
  const close = document.getElementById('closeMenu'); if(close) close.addEventListener('click', closeSidebar);
  const ov = document.getElementById('overlay'); if(ov) ov.addEventListener('click', closeSidebar);

  // checkout button (if exists)
  const btnCheckout = document.getElementById('btnCheckout');
  if(btnCheckout) btnCheckout.addEventListener('click', ()=>{
    // simulate checkout: clear cart and show simple success page
    localStorage.removeItem('hm_cart'); updateCartCounts();
    location.href = 'checkout.html';
  });
});
