// --- 1. เลือก Element เพิ่มเติม ---
const registerButton = document.querySelector('.confirm-btn'); // เปลี่ยนชื่อเพื่อความชัดเจน
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email'); // << เพิ่มเข้ามา
const passwordInput = document.querySelector('#password');
const togglePassword = document.querySelector('#togglePassword');

// Error message elements
const usernameError = document.querySelector('#username-error');
const emailError = document.querySelector('#email-error'); // << เพิ่มเข้ามา
const passwordError = document.querySelector('#password-error');

// --- Toggle Password Functionality (เหมือนเดิม) ---
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// --- Validation Functionality (อัปเดตใหม่) ---
registerButton.addEventListener('click', function (event) {
    event.preventDefault();

    // --- 2. รีเซ็ตสถานะทั้งหมด (รวม email) ---
    usernameInput.classList.remove('error');
    emailInput.classList.remove('error'); // << เพิ่มเข้ามา
    passwordInput.classList.remove('error');
    
    usernameError.classList.remove('show');
    emailError.classList.remove('show'); // << เพิ่มเข้ามา
    passwordError.classList.remove('show');

    // --- 3. ดึงค่าและตรวจสอบ (รวม email) ---
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim(); // << เพิ่มเข้ามา
    const password = passwordInput.value.trim();
    let isValid = true;

    // Check Username
    if (username === '') {
        usernameError.textContent = 'Please enter your username.';
        usernameError.classList.add('show');
        usernameInput.classList.add('error');
        isValid = false;
    }

    // Check Email
    if (email === '') {
        emailError.textContent = 'Please enter your email address.';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) { // << ตรวจสอบรูปแบบอีเมล (Email Format Validation)
        emailError.textContent = 'Please enter a valid email format.';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    }

    // Check Password
    if (password === '') {
        passwordError.textContent = 'Please enter your password.';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        isValid = false;
    }

    // --- 4. ถ้าทุกอย่างถูกต้อง ก็ไปหน้าถัดไป ---
    // if (isValid) {
    //     console.log('Validation passed. Redirecting...');
    //     // ในสถานการณ์จริง ตรงนี้จะส่งข้อมูลไปที่ Backend
    //     window.location.href = 'homepage.html';
    //     alert('Registration form is valid!');
    // }
});
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".confirm-btn");

    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !email || !password) {
            alert("⚠️ Please fill in all fields before logging in.");
            return;
        }

        // เพิ่มการตรวจสอบรูปแบบอีเมล
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("⚠️ Please enter a valid email format.");
            return;
        }

        // Build request payload
        const loginData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8081/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("❌ Login failed: " + (errorData.message || "Invalid credentials"));
                return;
            }

            const user = await response.json();

            alert(`✅ Welcome back, ${user.username}!`);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect to homepage
            window.location.href = "index.html";

        } catch (error) {
            console.error("Error:", error);
            alert("🚨 Server error, please try again later.");
        }
    });
});
