document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. เลือก Element ทั้งหมด ---
    const loginButton = document.querySelector('.confirm-btn');
    const usernameInput = document.querySelector('#username');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const togglePassword = document.querySelector('#togglePassword');

    // Error message elements
    const usernameError = document.querySelector('#username-error');
    const emailError = document.querySelector('#email-error');
    const passwordError = document.querySelector('#password-error');

    // --- 2. ฟังก์ชันสลับการแสดงรหัสผ่าน ---
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // --- 3. ฟังก์ชันหลักเมื่อกดปุ่ม Log In ---
    loginButton.addEventListener("click", async (e) => {
        e.preventDefault();

        // --- 3.1. รีเซ็ต Error messages ---
        usernameInput.classList.remove('error');
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        usernameError.classList.remove('show');
        emailError.classList.remove('show');
        passwordError.classList.remove('show');

        // --- 3.2. ดึงค่าและตรวจสอบ (Validation) ---
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        if (username === '') {
            usernameError.textContent = 'Please enter your username.';
            usernameError.classList.add('show');
            usernameInput.classList.add('error');
            isValid = false;
        }

        if (email === '') {
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

        if (password === '') {
            passwordError.textContent = 'Please enter your password.';
            passwordError.classList.add('show');
            passwordInput.classList.add('error');
            isValid = false;
        }

        // ถ้า Validation ไม่ผ่าน ให้หยุดทำงาน
        if (!isValid) {
            return;
        }

        // --- 3.3. สร้างข้อมูลที่จะส่งไป API ---
        const loginData = {
            username: username,
            email: email,
            password: password
        };

        try {
            // --- 3.4. ส่ง Request ไปยัง Backend ---
            const response = await fetch("http://localhost:8081/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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

            // --- 3.6. จัดการเมื่อ Login สำเร็จ ---
            const user = await response.json();

            // เก็บข้อมูล user ไว้ใน Local Storage
            localStorage.setItem("user", JSON.stringify(user));

            //
            // [!! นี่คือ LOGIC ใหม่ที่คนสวยต้องการ !!]
            //
            // --- 3.7. ตรวจสอบ Role และ Redirect ---
            // (ใช้ .toUpperCase() เพื่อความชัวร์ กันพิมพ์เล็ก/ใหญ่)
            if (user.role && user.role.toUpperCase() === 'ADMIN') {
                // ถ้าเป็น Admin
                alert(`✅ Welcome back, Admin ${user.username}!`);
                // พาไปหน้า Admin Dashboard
                window.location.href = "Admin/dashboard.html"; 
            } else {
                // ถ้าเป็น User ทั่วไป
                alert(`✅ Welcome back, ${user.username}!`);
                // พาไปหน้า User Homepage
                window.location.href = "index.html"; 
            }

        } catch (error) {
            // --- 3.8. จัดการเมื่อ Server ล่ม หรือ Network พัง ---
            console.error("Error:", error);
            passwordError.textContent = "Server error, please try again later.";
            passwordError.classList.add('show');
        }
    });
});