// --- Select elements once at the top ---
const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password'); // << ประกาศแค่ตรงนี้ที่เดียว
const loginButton = document.querySelector('.confirm-btn');
const usernameInput = document.querySelector('#username');
const usernameError = document.querySelector('#username-error');
const passwordError = document.querySelector('#password-error');


// --- Toggle Password Functionality ---
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});


// --- Validation Functionality ---
loginButton.addEventListener('click', function (event) {
    event.preventDefault();

    // รีเซ็ตสถานะ
    usernameInput.classList.remove('error');
    passwordInput.classList.remove('error'); // << สามารถใช้ตัวแปรเดิมได้เลย
    usernameError.classList.remove('show');
    passwordError.classList.remove('show');

    // ดึงค่าและตรวจสอบ
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim(); // << ใช้ตัวแปรเดิมได้เลย
    let isValid = true;

    if (username === '') {
        usernameError.textContent = 'Please enter your username or email.';
        usernameError.classList.add('show');
        usernameInput.classList.add('error');
        isValid = false;
    }

    if (password === '') {
        passwordError.textContent = 'Please enter your password.';
        passwordError.classList.add('show');
        passwordInput.classList.add('error'); // << ใช้ตัวแปรเดิมได้เลย
        isValid = false;
    }

    // ไปหน้าถัดไป
    if (isValid) {
        console.log('Validation passed. Redirecting...');
        window.location.href = 'homepage.html';
    }
});