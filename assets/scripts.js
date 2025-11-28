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
});
