
const typedEl = document.getElementById('typed');
const words = ['modern interfaces.', 'fast web apps.', 'accessible experiences.', 'delightful animations.'];
let i=0, j=0, back=false;
function tick(){
  if(!typedEl) return;
  const word = words[i];
  if(!back){
    typedEl.textContent = word.slice(0, j+1);
    j++;
    if(j===word.length){ back=true; setTimeout(tick,1200); return }
  } else {
    typedEl.textContent = word.slice(0, j-1);
    j--;
    if(j===0){ back=false; i=(i+1)%words.length }
  }
  setTimeout(tick, back?60:90);
}
setTimeout(tick, 400);


const themeToggle = document.getElementById('themeToggle');
themeToggle && themeToggle.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  themeToggle.textContent = isLight? '🌞' : '🌙';
});


const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
let lastFocusedEl = null;
let removeFocusTrap = null;
const projects = {
  'interactive-learning': {
    title: 'Interactive Learning Platform',
    desc: 'Frontend and UX for an education platform with live coding editors, quizzes, and adaptive content. Includes editor integrations, state management and responsive design.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=example',
    tech: ['Reactjs', 'TypeScript', 'Node.js', 'CSS Modules'],
    features: ['Live code editor with execution sandbox', 'Adaptive quizzes with instant feedback', 'Persistent progress and profiles'],
    live: '#',
    source: '#'
  },
  'tunhub': {
    title: 'TunHub Music Platform',
    desc: 'End-to-end music streaming platform built with microservices: streaming, user management, and payments. Focused on scalable APIs and reliable delivery.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=example',
    tech: ['Spring Boot', 'Docker', 'Java', 'MySQL'],
    features: ['Microservice-based streaming', ' user flows', 'Payment integration and billing'],
    
    live: '#',
    source: '#'
  },
  'food-console': {
    title: 'Console Food Ordering App',
    desc: 'A Java console application for order management, inventory and billing. Designed with modular services, input validation and exception handling.',
    image: 'https://static.vecteezy.com/system/resources/previews/014/215/223/original/food-company-logo-app-icon-and-splash-page-design-creative-business-app-design-elements-free-vector.jpg',
    tech: ['Java', 'Collections', 'OOP','SQL'],
    features: ['Modular order processing', 'Inventory tracking', 'Billing and receipts'],
    
    live: '#',
    source: '#'
  }
};

document.querySelectorAll('.project .more').forEach(btn=>{
  // Use currentTarget and prevent default navigation if button is an anchor
  btn.addEventListener('click', (e)=>{
    e.preventDefault && e.preventDefault();
    const project = e.currentTarget.closest('.project');
    if(!project) return;
    const id = project.dataset.project;
    openModal(id);
  });
});

function openModal(id){
  const p = projects[id] || {title: 'Project', desc: 'Details coming soon', live:'#', source:'#'};
  // Populate modal with richer layout: image, tech chips, features
  lastFocusedEl = document.activeElement;
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
  modal.classList.add('open');
  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media">
        <img src="${p.image || 'https://via.placeholder.com/640x360?text=Project'}" alt="${p.title}" />
      </div>
      <div class="modal-info">
        <h3>${p.title}</h3>
        <p class="muted">${p.year ? p.year : ''}</p>
        <p>${p.desc}</p>
        ${p.features? `<ul class="features">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>`: ''}
        ${p.tech? `<div class="tech">${p.tech.map(t=>`<span class="chip">${t}</span>`).join('')}</div>`: ''}
        <div class="modal-actions">
          ${p.live && p.live !== '#' ? `<a href="${p.live}" class="btn" target="_blank" rel="noopener">View live</a>` : ''}
          ${p.source && p.source !== '#' ? `<a href="${p.source}" class="btn outline" target="_blank" rel="noopener">Source</a>` : ''}
        </div>
      </div>
    </div>
  `;
  // focus the close button for accessibility
  const closeBtn = modal.querySelector('.close');
  if(closeBtn) closeBtn.focus();
  // enable focus trap for keyboard users and keep handler reference to remove later
  removeFocusTrap = enableFocusTrap(modal);
  // mark background content as inert for stronger focus isolation
  setInertForBackground(true);
}

modal.querySelector('.close').addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true') });

// Keep body scroll locked and restore on close; watch for aria changes
const observer = new MutationObserver(()=>{
  const hidden = modal.getAttribute('aria-hidden') === 'true';
  if(hidden){
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    // clear modal content after closing to free memory
    modalBody.innerHTML = '';
    // remove focus trap and restore last focused element
    if(typeof removeFocusTrap === 'function'){
      removeFocusTrap();
      removeFocusTrap = null;
    }
    try{ lastFocusedEl && lastFocusedEl.focus(); }catch(e){}
    // restore background interactivity
    setInertForBackground(false);
  }
});
observer.observe(modal, {attributes:true,attributeFilter:['aria-hidden']});

// Close modal on Escape
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
    modal.setAttribute('aria-hidden','true');
  }
});

/**
 * enableFocusTrap(container) -> returns a cleanup function
 * Traps Tab and Shift+Tab within focusable elements inside the container.
 */
function enableFocusTrap(container){
  const FOCUSABLE = 'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const nodes = Array.from(container.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null || n === container.querySelector('.close'));
  if(nodes.length === 0){
    // nothing to trap
    function noop(){ }
    return noop;
  }
  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  function keyHandler(e){
    if(e.key !== 'Tab') return;
    // forward tabbing
    if(!e.shiftKey){
      if(document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    } else {
      // reverse tabbing
      if(document.activeElement === first){
        e.preventDefault();
        last.focus();
      }
    }
  }

  document.addEventListener('keydown', keyHandler);

  // ensure a focusable element receives focus shortly after open
  setTimeout(()=>{
    const start = container.querySelector('.close') || first;
    try{ start.focus(); }catch(e){}
  }, 0);

  return ()=>{
    document.removeEventListener('keydown', keyHandler);
  };
}

// Make all siblings of the modal inert (non-interactive) to enforce focus isolation.
function setInertForBackground(enable){
  const FOCUSABLE = 'a[href], area[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  Array.from(document.body.children).forEach(node=>{
    if(node === modal) return; // skip modal
    if(node.tagName === 'SCRIPT') return; // skip scripts
    if(enable){
      // mark as inert
      node.setAttribute('aria-hidden','true');
      node.classList.add('inert');
      // store and remove tabindex from focusable descendants
      Array.from(node.querySelectorAll(FOCUSABLE)).forEach(el=>{
        if(el.hasAttribute('tabindex')){
          el.dataset.__prevTab = el.getAttribute('tabindex');
        } else {
          el.dataset.__prevTab = 'none';
        }
        try{ el.setAttribute('tabindex','-1'); }catch(e){}
      });
    } else {
      // restore
      node.removeAttribute('aria-hidden');
      node.classList.remove('inert');
      Array.from(node.querySelectorAll('[data-__prev-tab]')).forEach(el=>{
        const prev = el.dataset.__prevTab;
        if(prev === 'none'){
          el.removeAttribute('tabindex');
        } else {
          el.setAttribute('tabindex', prev);
        }
        delete el.dataset.__prevTab;
      });
    }
  });
}


const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
form && form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const name = fd.get('name');
  formMsg.textContent = 'Sending...';
  setTimeout(()=>{
    formMsg.textContent = `Thanks ${name}! I'll get back to you soon.`;
    form.reset();
  }, 900);
});


document.getElementById('year').textContent = new Date().getFullYear();


const bars = document.querySelectorAll('.bar div');
function animateBars(){
  bars.forEach(b=>{ const pct = b.style.getPropertyValue('--pct'); if(!pct || b.dataset.animated) return; b.style.width = pct; b.dataset.animated = 'true' });
}

document.querySelectorAll('.bar div').forEach(b=>{ const v = b.style.getPropertyValue('--pct'); if(!v) {

  const computed = getComputedStyle(b).width; 
} else {
  b.style.width = '6px'; 
  setTimeout(()=> b.style.width = v, 300);
}});


const ham = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
ham && ham.addEventListener('click', ()=>{ nav.style.display = (nav.style.display==='flex')? 'none':'flex' });