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

// 1. หาปุ่ม logout ในหน้าเว็บ
const logoutButton = document.getElementById('logout-button');

// 2. ตรวจสอบว่าเจอปุ่มหรือไม่ (เพื่อป้องกัน error ในหน้าที่ไม่มีปุ่มนี้)
if (logoutButton) {
    // 3. เพิ่ม Event Listener เพื่อดักจับการคลิก
    logoutButton.addEventListener('click', () => {

        // --- ✨ ขั้นตอนสำคัญของการ Logout ✨ ---

        // 4. ลบ Token ที่เก็บไว้ (หลักฐานการล็อกอิน)
        // สมมติว่าตอน login ได้เก็บ token ไว้ใน localStorage
        localStorage.removeItem('token');
        
        // 5. "แทนที่" หน้าปัจจุบันด้วยหน้า login.html
        // คำสั่งนี้จะไม่ถูกบันทึกใน history ทำให้กดย้อนกลับไม่ได้
        window.location.replace('/login.html');
    });
}