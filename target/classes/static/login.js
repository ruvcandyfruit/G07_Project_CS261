// --- 1. เลือก Element เพิ่มเติม ---
const loginButton = document.querySelector('.confirm-btn');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#togglePassword');

// Error message elements
const usernameError = document.querySelector('#username-error');
const emailError = document.querySelector('#email-error');
const passwordError = document.querySelector('#password-error');

// Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// ตรวจสอบฟอร์มก่อนส่ง
function validateForm() {
    usernameInput.classList.remove('error');
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
    usernameError.classList.remove('show');
    emailError.classList.remove('show');
    passwordError.classList.remove('show');

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    if (!username) {
        usernameError.textContent = 'Please enter your username.';
        usernameError.classList.add('show');
        usernameInput.classList.add('error');
        isValid = false;
    }
    if (!email) {
        emailError.textContent = 'Please enter your email address.';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = 'Please enter a valid email format.';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    }
    if (!password) {
        passwordError.textContent = 'Please enter your password.';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        isValid = false;
    }

    return isValid;
}

document.addEventListener("DOMContentLoaded", function () {
    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const loginData = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };

        try {
            // --- 3.4. ส่ง Request ไปยัง Backend ---
            const response = await fetch("http://localhost:8081/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            // --- 3.5. จัดการเมื่อ Login ไม่สำเร็จ (เช่น รหัสผิด) ---
            if (!response.ok) {
                const errorData = await response.json();
                // แสดง Error ที่ช่องรหัสผ่าน
                passwordError.textContent = errorData.message || "Invalid credentials";
                passwordError.classList.add('show');
                passwordInput.classList.add('error');
                return;
            }

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify({
                username: loginData.username,
                role: data.role
            }));
            
            if (data.token) localStorage.setItem("token", data.token);
            if (data.userId) localStorage.setItem("userId", data.userId);
            if (data.role) localStorage.setItem("role", data.role);
            if (data.email) localStorage.setItem("email", data.email);

            alert(`✅ Welcome back, ${data.username}!`);

            if (data.role === 'ADMIN') {
                window.location.href = 'Admin/dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } catch (error) {
            // --- 3.8. จัดการเมื่อ Server ล่ม หรือ Network พัง ---
            console.error("Error:", error);
            passwordError.textContent = "Server error, please try again later.";
            passwordError.classList.add('show');
        }
    });
});