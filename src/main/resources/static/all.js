// ===== เช็คสถานะ Login จาก Spring Boot Backend =====
async function checkLoginStatus() {
    try {
        // เรียก API เพื่อเช็คว่ามี session/cookie หรือไม่
        const response = await fetch('/api/auth/check', {
            method: 'GET',
            credentials: 'include', // สำคัญ! ส่ง cookie ไปด้วย
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Login อยู่ - Backend ส่งข้อมูล user กลับมา
            const data = await response.json();
            return {
                isLoggedIn: true,
                user: data.user // { username, email, ... }
            };
        } else {
            // ไม่ได้ login หรือ session หมดอายุ
            return { isLoggedIn: false };
        }
    } catch (error) {
        console.error('Check login status error:', error);
        // ถ้าเกิด error ให้ถือว่าไม่ได้ login
        return { isLoggedIn: false };
    }
}

// ===== Logout Function =====
async function handleLogout() {
    try {
        // เรียก API logout ที่ Spring Boot
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // ลบข้อมูลใน localStorage (ถ้ามี)
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            
            // อัพเดท UI
            updateLoginStatus(false);
            
            // ปิด popup
            const popup = document.getElementById('profile-popup');
            if (popup) {
                popup.style.display = 'none';
            }
            
            // Redirect ไปหน้า login หรือ reload หน้าปัจจุบัน
            // เลือกอย่างใดอย่างหนึ่ง:
            
            // ตัวเลือก 1: Reload หน้าปัจจุบัน (แนะนำสำหรับหน้าที่ไม่บังคับ login)
            window.location.reload();
            
            // ตัวเลือก 2: Redirect ไปหน้า login
            // window.location.href = '/login.html';
            
        } else {
            console.error('Logout failed');
            alert('เกิดข้อผิดพลาดในการออกจากระบบ');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
}

// เพิ่ม function สำหรับจัดการสถานะ login (เรียกใช้ใน HTML หลัง login สำเร็จ)
function updateLoginStatus(isLoggedIn) {
    // อัพเดทปุ่มในตำแหน่งปกติ
    const loginButt = document.getElementById('login-butt');
    const registerButt = document.getElementById('register-butt');
    const profile = document.getElementById('profile');

    if (isLoggedIn) {
        // แสดงปุ่ม profile, ซ่อน login/register
        if (loginButt) loginButt.style.display = 'none';
        if (registerButt) registerButt.style.display = 'none';
        if (profile) profile.style.display = 'inline-block';

        // เก็บข้อมูล user ใน localStorage สำหรับแสดงผล
        if (userData) {
            localStorage.setItem('username', userData.username || 'User');
            localStorage.setItem('email', userData.email || '');
        }
    } else {
        // แสดงปุ่ม login/register, ซ่อน profile
        if (loginButt) loginButt.style.display = 'inline';
        if (registerButt) registerButt.style.display = 'inline';
        if (profile) profile.style.display = 'none';

        // ลบข้อมูลใน localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('email');
    }

    // อัพเดทปุ่มใน top-bar สำหรับหน้าจอเล็ก (ถ้ามี)
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        const topLoginButt = topBar.querySelector('#login-butt');
        const topRegisterButt = topBar.querySelector('#register-butt');
        const topProfile = topBar.querySelector('#profile');
        
        if (isLoggedIn) {
            if (topLoginButt) topLoginButt.style.display = 'none';
            if (topRegisterButt) topRegisterButt.style.display = 'none';
            if (topProfile) topProfile.style.display = 'inline-block';
            topBar.classList.add('logged-in');
        } else {
            if (topLoginButt) topLoginButt.style.display = 'inline';
            if (topRegisterButt) topRegisterButt.style.display = 'inline';
            if (topProfile) topProfile.style.display = 'none';
            topBar.classList.remove('logged-in');
        }
    }
}

// ===== แสดง Profile Popup =====
function showProfilePopup(event) {
    event.stopPropagation();
    const popup = document.getElementById('profile-popup');
    
    if (popup) {
        popup.style.display = 'flex';
        
        // อ่านข้อมูลจาก localStorage
        const username = localStorage.getItem('username') || 'User';
        const email = localStorage.getItem('email') || '';
        
        const usernameEl = document.getElementById('profile-username');
        const emailEl = document.getElementById('profile-email');
        
        if (usernameEl) usernameEl.textContent = username;
        if (emailEl) emailEl.textContent = email;
    }
}

// แก้ไข function restructureHeader() - ใช้ Cookie
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
            topBar.appendChild(navAccount.cloneNode(true)); // ย้าย nav-account ไปใน top-bar
            
            // เพิ่ม top-bar ไว้ด้านบนสุดของ header
            header.insertBefore(topBar, header.firstChild);   
            navbar.appendChild(hamburger);  // ย้าย hamburger เข้าไปใน navbar (ชั้นล่าง)
            header.classList.add('header-restructured');    // เพิ่ม class สำหรับ styling

            // *** เพิ่ม: ผูก event listener กับปุ่ม profile ใน top-bar ***
            const topBarProfile = topBar.querySelector('#profile');
            if (topBarProfile) {
                topBarProfile.addEventListener('click', showProfilePopup);
            }

            // ผูก event listener กับ logout button ใน top-bar
            const topBarLogout = topBar.querySelector('#logout-button');
            if (topBarLogout) {
                topBarLogout.addEventListener('click', handleLogout);
            }
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
            // *** เพิ่ม: ผูก event listener กับปุ่ม profile ตำแหน่งเดิม ***
            attachProfileListener();
        }
    }
}

// *** เพิ่ม: function สำหรับผูก event listener กับปุ่ม profile ***
function attachProfileListener() {
    const profileBtn = document.getElementById('profile');
    if (profileBtn) {
        // ลบ event listener เดิมก่อน (ถ้ามี) เพื่อป้องกันการผูกซ้ำ
        profileBtn.removeEventListener('click', showProfilePopup);
        // ผูกใหม่
        profileBtn.addEventListener('click', showProfilePopup);
    }
}

// Hamburger ไว้เก็บ nav bar ตอนหน้าจอเล็ก
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', (event) => {
        event.stopPropagation();
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });
}
// ปิด popup เมื่อคลิกข้างนอก
document.addEventListener('click', (event) => {
    const popup = document.getElementById('profile-popup');
    const profileBtn = document.getElementById('profile');
    const topBarProfile = document.querySelector('.top-bar #profile');
    
    if (popup && popup.style.display === 'flex') {
        if (!popup.contains(event.target) && 
            event.target !== profileBtn && 
            event.target !== topBarProfile &&
            !profileBtn?.contains(event.target) &&
            !topBarProfile?.contains(event.target)) {
            popup.style.display = 'none';
        }
    }
});

// ===== เริ่มต้นตอนโหลดหน้า =====
async function initializePage() {
    // เช็คสถานะ login
    const loginStatus = await checkLoginStatus();
    
    // อัพเดท UI ตามสถานะ
    updateLoginStatus(loginStatus.isLoggedIn, loginStatus.user);
    
    // จัดการ responsive header
    restructureHeader();
    attachProfileListener();
    
    // ผูก event listener กับปุ่ม logout
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// เรียกใช้ตอนโหลดหน้า
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// เรียกใช้ตอนปรับขนาดหน้าจอ
window.addEventListener('resize', restructureHeader);