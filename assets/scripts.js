// Basic interactivity: menu toggle, accordion, gallery lightbox, contact form stub
document.addEventListener('DOMContentLoaded', function(){
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', function(){
    var expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if(mainNav.style.display === 'block') mainNav.style.display = '';
    else mainNav.style.display = 'block';
  });

  // Accordion
  document.querySelectorAll('.accordion-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var panel = this.nextElementSibling;
      var open = panel.style.display === 'block';
      panel.style.display = open ? '' : 'block';
    });
  });

  // Gallery lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery-item').forEach(function(img){
    img.addEventListener('click', function(){
      lightboxImg.src = this.src;
      lightbox.style.visibility = 'visible';
      lightbox.style.opacity = '1';
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  lightbox.addEventListener('click', function(){
    lightbox.style.opacity = '0';
    setTimeout(function(){lightbox.style.visibility='hidden';lightbox.setAttribute('aria-hidden','true');lightboxImg.src=''},200);
  });

  // Contact form stub - show quick success message
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      alert('तुमचा संदेश पाठविण्यात आला आहे. धन्यवाद!');
      contactForm.reset();
    });
  }

  // Settings panel - background color and font
  var settingsToggle = document.getElementById('settingsToggle');
  var settingsPanel = document.getElementById('settingsPanel');
  var settingsClose = document.getElementById('settingsClose');
  var bgColorInput = document.getElementById('bgColorInput');
  var fontSelect = document.getElementById('fontSelect');

  function applySettings(){
    try{
      var bg = localStorage.getItem('gp_bg') || bgColorInput.value;
      var font = localStorage.getItem('gp_font') || fontSelect.value;
      document.body.style.backgroundColor = bg;
      document.body.style.fontFamily = font;
      if(bgColorInput) bgColorInput.value = bg;
      if(fontSelect) fontSelect.value = font;
    }catch(e){console.warn(e)}
  }
  applySettings();

  if(settingsToggle){
    settingsToggle.addEventListener('click', function(){
      var open = settingsPanel.style.display === 'block';
      settingsPanel.style.display = open ? 'none' : 'block';
      this.setAttribute('aria-expanded', String(!open));
      settingsPanel.setAttribute('aria-hidden', String(open));
    });
  }
  if(settingsClose){ settingsClose.addEventListener('click', function(){ settingsPanel.style.display='none'; settingsToggle.setAttribute('aria-expanded','false'); settingsPanel.setAttribute('aria-hidden','true'); }); }
  if(bgColorInput){ bgColorInput.addEventListener('input', function(){ document.body.style.backgroundColor = this.value; localStorage.setItem('gp_bg', this.value); }); }
  if(fontSelect){ fontSelect.addEventListener('change', function(){ document.body.style.fontFamily = this.value; localStorage.setItem('gp_font', this.value); }); }

  // Events image upload (client-side)
  var eventForm = document.getElementById('eventUploadForm');
  var eventFiles = document.getElementById('eventFiles');
  var eventsGallery = document.getElementById('eventsGallery');

  function loadStoredEvents(){
    try{
      var stored = JSON.parse(localStorage.getItem('gp_events') || '[]');
      stored.forEach(function(item){ appendEvent(item); });
    }catch(e){console.warn('load events',e)}
  }

  function saveEventData(){
    var imgs = [];
    eventsGallery.querySelectorAll('img').forEach(function(img){ imgs.push(img.src); });
    localStorage.setItem('gp_events', JSON.stringify(imgs));
  }

  function appendEvent(src){
    var wrap = document.createElement('div'); wrap.className='event-item';
    var img = document.createElement('img'); img.src = src; img.alt='Event image';
    var btn = document.createElement('button'); btn.className='event-remove'; btn.textContent='काढा';
    btn.addEventListener('click', function(){ wrap.remove(); saveEventData(); });
    img.addEventListener('click', function(){ lightboxImg.src = img.src; lightbox.style.visibility='visible'; lightbox.style.opacity='1'; lightbox.setAttribute('aria-hidden','false'); });
    wrap.appendChild(img); wrap.appendChild(btn); eventsGallery.appendChild(wrap);
  }

  if(eventForm){
    eventForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(!eventFiles || !eventFiles.files || eventFiles.files.length===0){ alert('कृपया काही प्रतिमा निवडा.'); return; }
      Array.from(eventFiles.files).forEach(function(file){
        compressImage(file, 1000, 0.75).then(function(dataUrl){
          appendEvent(dataUrl);
          saveEventData();
        }).catch(function(){
          // fallback to original if compression fails
          var reader = new FileReader();
          reader.onload = function(ev){ appendEvent(ev.target.result); saveEventData(); };
          reader.readAsDataURL(file);
        });
      });
      eventForm.reset();
    });
  }
  loadStoredEvents();

  // Compress image file to dataURL using canvas
  function compressImage(file, maxWidth, quality){
    return new Promise(function(resolve, reject){
      if(!file.type.startsWith('image/')) return reject(new Error('Not image'));
      var img = new Image();
      var reader = new FileReader();
      reader.onload = function(ev){
        img.onload = function(){
          var canvas = document.createElement('canvas');
          var ratio = img.width / img.height;
          var width = img.width;
          var height = img.height;
          if(width > maxWidth){
            width = maxWidth;
            height = Math.round(maxWidth / ratio);
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          try{
            var dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          }catch(err){ reject(err); }
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
});
