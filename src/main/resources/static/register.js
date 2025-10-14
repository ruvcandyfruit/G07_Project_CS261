// --- 1. เลือก Element ทั้งหมดที่ต้องใช้ ---
const signupButton = document.querySelector('.confirm-btn');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email'); // << เพิ่มเข้ามา
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');

// Icon and Message elements
const usernameStatusIcon = document.querySelector('#username-status-icon');
const usernameMessage = document.querySelector('#username-message');
const emailError = document.querySelector('#email-error'); // << เพิ่มเข้ามา
const passwordMessage = document.querySelector('#password-message');
const confirmPasswordMessage = document.querySelector('#confirm-password-message');

// Toggle Password elements
const togglePassword = document.querySelector('#togglePassword');
const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');


// --- 2. ฟังก์ชัน Toggle Password ---
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

toggleConfirmPassword.addEventListener('click', function () {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});


// --- 3. ฟังก์ชันตรวจสอบ Username ซ้ำ ---
usernameInput.addEventListener('blur', async function() {
    const username = usernameInput.value.trim();
    showMessage(usernameMessage, '', '');
    usernameStatusIcon.className = 'fa-solid fa-circle-check status-icon';

    if (username === '') return;

    try {
        const isTaken = (username === 'admin' || username === 'test');
        if (isTaken) {
            showMessage(usernameMessage, 'This username is already taken.', 'error');
        } else {
            usernameStatusIcon.classList.add('show', 'success');
        }
    } catch (error) {
        showMessage(usernameMessage, 'Could not check username.', 'error');
    }
});


// --- 4. ฟังก์ชันหลักเมื่อกดปุ่ม Sign up ---
signupButton.addEventListener('click', function(event) {
    event.preventDefault();

    let isValid = true;

    // --- ตรวจสอบ Username ---
    if (usernameInput.value.trim() === '' || usernameMessage.classList.contains('error')) {
        isValid = false;
        if(usernameInput.value.trim() === '') {
            showMessage(usernameMessage, 'Username cannot be empty.', 'error');
        }
    }

    // --- ตรวจสอบ Email ที่เพิ่มเข้ามา ---
    const email = emailInput.value.trim();
    if (email === '') {
        showMessage(emailError, 'Email address cannot be empty.', 'error');
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) { // ตรวจสอบ Format
        showMessage(emailError, 'Please enter a valid email format.', 'error');
        isValid = false;
    } else {
        showMessage(emailError, '', ''); // ซ่อนถ้าผ่าน
    }

    // --- ตรวจสอบ Password ---
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (password.length < 8) {
        showMessage(passwordMessage, 'Password must be at least 8 characters.', 'error');
        isValid = false;
    } else {
        showMessage(passwordMessage, '', '');
    }

    if (password !== confirmPassword || confirmPassword === '') {
        showMessage(confirmPasswordMessage, 'Passwords do not match.', 'error');
        isValid = false;
    } else {
        showMessage(confirmPasswordMessage, '', '');
    }

    // --- 5. ถ้าทุกอย่างถูกต้อง ก็ส่งฟอร์ม ---
    if (isValid) {
        alert('Registration successful!');
        window.location.href = 'login.html';
    }
});


// --- 6. ฟังก์ชันช่วยแสดงข้อความ (Helper Function) ---
function showMessage(element, message, type) {
    element.textContent = message;
    // ใช้ error-message สำหรับ email และ message สำหรับอันอื่น
    element.className = element.id.includes('email') ? 'error-message' : 'message'; 
    if (type) {
        element.classList.add(type, 'show');
    }
}