// --- 1. เลือก Element ทั้งหมดที่ต้องใช้ ---
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirm-password');
const signupButton = document.querySelector('.confirm-btn');
const usernameStatusIcon = document.querySelector('#username-status-icon');

// Element สำหรับแสดงข้อความ
const usernameMessage = document.querySelector('#username-message');
const passwordMessage = document.querySelector('#password-message');
const confirmPasswordMessage = document.querySelector('#confirm-password-message');

// Element สำหรับ Toggle Password
const togglePassword = document.querySelector('#togglePassword');
const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');


// --- 2. ฟังก์ชัน Toggle Password (ต้องทำ 2 อัน) ---
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


// --- 3. ฟังก์ชันตรวจสอบ Username ซ้ำ (จำลองการคุยกับหลังบ้าน) ---
// ฟังก์ชันนี้จะทำงานเมื่อผู้ใช้พิมพ์เสร็จแล้วคลิกออกนอกช่อง (blur)
usernameInput.addEventListener('blur', async function() {
    const username = usernameInput.value.trim();
    
    // --- รีเซ็ตสถานะทุกครั้งที่เริ่มตรวจสอบ ---
    showMessage(usernameMessage, '', ''); // ซ่อนข้อความเก่า
    usernameStatusIcon.className = 'fa-solid fa-circle-check status-icon'; // รีเซ็ตคลาสไอคอน

    if (username === '') {
        return; // ไม่ต้องทำอะไรถ้าช่องว่าง
    }

    // --- ส่วนจำลองการคุยกับหลังบ้าน ---
    try {
        // ** สมมติว่า Server ตอบกลับมา **
        const isTaken = (username === 'admin' || username === 'test');

        if (isTaken) {
            // ถ้าชื่อซ้ำ: แสดงข้อความ Error เหมือนเดิม
            showMessage(usernameMessage, 'This username or email is already taken.', 'error');
        } else {
            // ✨ ถ้าชื่อใช้ได้: แสดงไอคอนติ๊กถูกสีเขียว ✨
            usernameStatusIcon.classList.add('show', 'success');
        }

    } catch (error) {
        showMessage(usernameMessage, 'Could not check username. Please try again.', 'error');
    }
});



// --- 4. ฟังก์ชันหลักเมื่อกดปุ่ม Sign up ---
signupButton.addEventListener('click', function(event) {
    event.preventDefault(); // หยุดการส่งฟอร์มไว้ก่อน

    let isValid = true;

    // ตรวจสอบ Password ว่าตรงกันหรือไม่
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password.length < 8) {
        showMessage(passwordMessage, 'Password must be at least 8 characters.', 'error');
        isValid = false;
    } else {
        showMessage(passwordMessage, '', ''); // ซ่อนถ้าผ่าน
    }

    if (password !== confirmPassword) {
        showMessage(confirmPasswordMessage, 'Passwords do not match.', 'error');
        isValid = false;
    } else {
        showMessage(confirmPasswordMessage, '', ''); // ซ่อนถ้าผ่าน
    }
    
    // ตรวจสอบว่า Username ว่างหรือไม่ หรือมี error ค้างอยู่หรือไม่
    if (usernameInput.value.trim() === '' || usernameMessage.classList.contains('error')) {
        isValid = false;
        if(usernameInput.value.trim() === '') {
            showMessage(usernameMessage, 'Username cannot be empty.', 'error');
        }
    }


    // --- 5. ถ้าทุกอย่างถูกต้อง ก็ส่งฟอร์ม ---
    if (isValid) {
        alert('Registration successful!');
        // ในสถานการณ์จริง บรรทัดต่อไปนี้จะทำการส่งข้อมูลไปยัง Server
        // document.querySelector('form').submit(); 
        window.location.href = 'login.html'; // หรือไปหน้า login
    }
});


// --- 6. ฟังก์ชันช่วยแสดงข้อความ (Helper Function) ---
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message'; // รีเซ็ตคลาสก่อน
    if (type) {
        element.classList.add(type); // 'error' หรือ 'success'
        element.classList.add('show');
    }
}