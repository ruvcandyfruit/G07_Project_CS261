const togglePassword = document.querySelector('#togglePassword');
const passwordInput = document.querySelector('#password-input');

togglePassword.addEventListener('click', function () {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});