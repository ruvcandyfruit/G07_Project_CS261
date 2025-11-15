// JavaScript สำหรับจัดเรียงโครงสร้าง Header ใหม่
function restructureHeader() {
    if (window.innerWidth <= 768) {
        const header = document.querySelector('header');
        const navbar = document.querySelector('.navbar');
        const navAccount = document.querySelector('.nav-account');
        const hamburger = document.querySelector('.hamburger');
        
        // ตรวจสอบว่ายังไม่มี top-bar
        if (!document.querySelector('.top-bar')) {
            // สร้าง top-bar (ชั้นบน)
            const topBar = document.createElement('div');
            topBar.className = 'top-bar';
            
            // ย้าย nav-account ไปใน top-bar
            topBar.appendChild(navAccount.cloneNode(true));
            
            // เพิ่ม top-bar ไว้ด้านบนสุดของ header
            header.insertBefore(topBar, header.firstChild);
            
            // ย้าย hamburger เข้าไปใน navbar (ชั้นล่าง)
            navbar.appendChild(hamburger);
            
            // เพิ่ม class สำหรับ styling
            header.classList.add('header-restructured');
        }
    } else {
        // ถ้าหน้าจอใหญ่ขึ้น ให้เอาโครงสร้างกลับมาเป็นปกติ
        const header = document.querySelector('header');
        const topBar = document.querySelector('.top-bar');
        const hamburger = document.querySelector('.hamburger');
        
        if (topBar) {
            topBar.remove();
            // ย้าย hamburger กลับไปที่เดิม
            header.appendChild(hamburger);
            header.classList.remove('header-restructured');
        }
    }
}

// เรียกใช้ตอนโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', restructureHeader);

// เรียกใช้ตอนปรับขนาดหน้าจอ
window.addEventListener('resize', restructureHeader);

// --- JavaScript เดิมของคุณ ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    navLinks.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
        navLinks.classList.remove('active');
    }
});

const logoutButton = document.getElementById('logout-button');

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.replace('/login.html');
    });
}