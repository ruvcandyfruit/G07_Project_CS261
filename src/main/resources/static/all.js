const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', (event) => {
    event.stopPropagation(); // กันไม่ให้คลิกทะลุไปถึง document
    navLinks.classList.toggle('active');
  });

  // คลิกข้างนอกเมนู => ปิดเมนู
  document.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
      navLinks.classList.remove('active');
    }
  });
