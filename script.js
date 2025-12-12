/* ====== DATA: productos de ejemplo ====== */
const PRODUCTS = [
  {id:1,name:"Polera Oversize",price:49.9,cat:"Mujer",img:"https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop&q=80",sizes:["S","M","L"]},
  {id:2,name:"Casaca Negra",price:89.9,cat:"Hombre",img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=80",sizes:["M","L","XL"]},
  {id:3,name:"Vestido Floral",price:69.5,cat:"Mujer",img:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop&q=80",sizes:["S","M","L"]},
  {id:4,name:"Jeans Clásicos",price:79.0,cat:"Hombre",img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=80",sizes:["M","L","XL"]},
  {id:5,name:"Blusa Elegante",price:39.9,cat:"Mujer",img:"https://images.unsplash.com/photo-1594633312686-9f5f16ec7eaa?w=800&h=1000&fit=crop&q=80",sizes:["S","M"]},
  {id:6,name:"Gorra Street",price:19.9,cat:"Accesorios",img:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&q=80",sizes:[]},
  {id:7,name:"Zapatos Running",price:99.0,cat:"Hombre",img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=80",sizes:["40","41","42"]},
  {id:8,name:"Bolso de Cuero",price:120.0,cat:"Mujer",img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&q=80",sizes:[]},
  {id:9,name:"Short Veraniego",price:29.9,cat:"Mujer",img:"https://images.unsplash.com/photo-1594633312686-9f5f16ec7eaa?w=800&h=1000&fit=crop&q=80",sizes:["S","M","L"]},
  {id:10,name:"Sudadera Con Capucha",price:59.9,cat:"Hombre",img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80",sizes:["M","L","XL"]},
  {id:11,name:"Cinturón Piel",price:25.0,cat:"Accesorios",img:"https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&h=800&fit=crop&q=80",sizes:[]},
  {id:12,name:"Camisa Formal",price:45.0,cat:"Hombre",img:"https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1000&fit=crop&q=80",sizes:["M","L"]}
];

/* ====== SIDEBAR CONTROL ====== */
const sidebar = () => document.getElementById('sidebar');
const overlay = () => document.getElementById('overlay');

const openSidebar = () => {
  const s = sidebar();
  if (!s) return;
  s.classList.add('active');
  overlay().classList.add('show');
  document.body.style.overflow = 'hidden';
};

const closeSidebar = () => {
  const s = sidebar();
  if (!s) return;
  s.classList.remove('active');
  overlay().classList.remove('show');
  document.body.style.overflow = '';
};

// Close sidebar when clicking outside
overlay()?.addEventListener('click', closeSidebar);

// Toggle sidebar when menu button is clicked
document.addEventListener('click', (e) => {
  if (e.target?.closest('#btnMenu')) {
    e.preventDefault();
    openSidebar();
  }
  
  if (e.target?.closest('#closeMenu') || e.target?.closest('.overlay')) {
    e.preventDefault();
    closeSidebar();
  }
});

// Close sidebar when clicking on a link inside it
document.querySelectorAll('.sidebar-links a').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

/* ====== CART (localStorage) ====== */
function saveCart(cart) {
  try {
    localStorage.setItem('hm_cart', JSON.stringify(cart));
    updateCartCounts();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('hm_cart') || '[]');
  } catch (e) {
    console.error('Error loading cart:', e);
    return [];
  }
}

function updateCartCounts() {
  try {
    const count = loadCart().reduce((sum, item) => sum + (item.qty || 0), 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      if (el) el.textContent = count > 0 ? count : '';
    });
  } catch (e) {
    console.error('Error updating cart counts:', e);
  }
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
    <div class="page-header">
      <a href="index.html" class="back-button">
        <i class="fas fa-arrow-left"></i>
        <span>Volver al inicio</span>
      </a>
      <h2 class="section-title">Detalle del producto</h2>
    </div>
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
  const area = elq('#cartArea'); 
  if(!area) return;
  
  const cart = loadCart();
  if(cart.length === 0) { 
    area.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Tu carrito está vacío</p>
        <a href="productos.html" class="btn btn-primary">Seguir comprando</a>
      </div>`; 
    return; 
  }
  
  let html = '';
  cart.forEach((it, idx) => {
    const prod = PRODUCTS.find(p => p.id === it.id);
    if (!prod) return;
    
    html += `
    <div class="cart-item">
      <img src="${prod.img}" alt="${prod.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-title">${prod.name} ${it.size ? (' - ' + it.size) : ''}</div>
        <div class="cart-item-price">S/ ${(prod.price * it.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-idx="${idx}" data-op="minus" aria-label="Reducir cantidad">-</button>
          <span>${it.qty}</span>
          <button class="qty-btn" data-idx="${idx}" data-op="plus" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <button class="btn-remove" data-idx="${idx}" data-op="remove" aria-label="Eliminar producto">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  });
  
  // Calculate total
  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  
  // Add total and checkout button
  html += `
    <div class="cart-summary">
      <div class="cart-total">
        <span>Total:</span>
        <span class="total-amount">S/ ${total.toFixed(2)}</span>
      </div>
      <button id="btnCheckout" class="btn btn-primary btn-block">
        Finalizar compra
      </button>
      <a href="productos.html" class="btn btn-outline btn-block">
        Seguir comprando
      </a>
    </div>`;
    
  area.innerHTML = html;

  // Add event listeners to quantity buttons
  area.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const idx = parseInt(button.dataset.idx);
      const op = button.dataset.op;
      const cart = loadCart();
      
      if (idx >= 0 && idx < cart.length) {
        if (op === 'plus') {
          cart[idx].qty += 1;
        } else if (op === 'minus' && cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        }
        saveCart(cart);
        renderCartPage();
      }
    });
  });
  
  // Add event listeners to remove buttons
  area.querySelectorAll('.btn-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (confirm('¿Estás seguro de eliminar este artículo del carrito?')) {
        const idx = parseInt(button.dataset.idx);
        const cart = loadCart();
        
        if (idx >= 0 && idx < cart.length) {
          cart.splice(idx, 1);
          saveCart(cart);
          renderCartPage();
        }
      }
    });
  });
  
  // Add event listener to checkout button
  const checkoutBtn = elq('#btnCheckout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Here you would typically redirect to checkout
      alert('Procesando pago...');
      // window.location.href = 'checkout.html';
    });
  }
}

/* Add to cart helper */
function addToCart(id, size=''){
  const cart = loadCart();
  const found = cart.find(i=>i.id===id && i.size===size);
  if(found) found.qty +=1; else cart.push({id,qty:1,size});
  saveCart(cart);
  alert('Producto agregado al carrito');
}

/* ====== SLIDER FUNCTIONALITY ====== */
function initSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  const dotsContainer = slider.querySelector('.slider-dots');
  let currentSlide = 0;
  let slideInterval;

  // Create dots
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = slider.querySelectorAll('.dot');

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
    updateDots();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  // Auto-advance slides
  function startSlider() {
    stopSlider();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Pause on hover
  slider.addEventListener('mouseenter', stopSlider);
  slider.addEventListener('mouseleave', startSlider);

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopSlider();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startSlider();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < threshold) return;
    
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  // Initialize
  startSlider();
  updateDots();
}

/* ====== BUTTON STYLING ====== */
function styleButtons() {
  // Add loading state to buttons
  document.querySelectorAll('button, .btn, a.btn').forEach(btn => {
    // Skip if already processed
    if (btn.classList.contains('btn-styled')) return;
    
    btn.classList.add('btn-styled');
    
    // Add ripple effect
    btn.addEventListener('click', function(e) {
      // Don't add ripple to buttons that should navigate
      if (this.tagName === 'A' && this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
        return;
      }
      
      e.preventDefault();
      
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
        // If it's a link, navigate after the animation
        if (this.tagName === 'A' && this.getAttribute('href')) {
          window.location.href = this.getAttribute('href');
        }
      }, 600);
    });
  });
}

/* ====== INITIALIZATION ====== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart
  updateCartCounts();
  
  // Initialize page-specific components
  renderFeatured();
  renderProductsPage();
  renderDetailPage();
  renderCartPage();
  
  // Initialize slider if it exists
  initSlider();
  
  // Style all buttons
  styleButtons();
  
  // Search functionality
  const searchToggle = document.querySelector('.search-toggle');
  const searchBox = document.querySelector('.search-box');
  
  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchBox.classList.toggle('active');
      if (searchBox.classList.contains('active')) {
        searchBox.querySelector('input')?.focus();
      }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
        searchBox.classList.remove('active');
      }
    });
    
    // Handle search form submission
    const searchForm = searchBox.querySelector('form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchForm.querySelector('input')?.value;
        if (query) {
          window.location.href = `productos.html?q=${encodeURIComponent(query)}`;
        }
      });
    }
  }
  
  // Handle newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();
      
      if (email && validateEmail(email)) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = '¡Gracias por suscribirte!';
        
        const formContainer = newsletterForm.parentElement;
        formContainer.insertBefore(successMessage, newsletterForm.nextSibling);
        
        // Reset form
        newsletterForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      } else {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-error';
        errorMessage.textContent = 'Por favor ingresa un correo electrónico válido.';
        
        const formContainer = newsletterForm.parentElement;
        formContainer.insertBefore(errorMessage, newsletterForm.nextSibling);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
          errorMessage.remove();
        }, 5000);
      }
    });
  }
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Helper function to validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
