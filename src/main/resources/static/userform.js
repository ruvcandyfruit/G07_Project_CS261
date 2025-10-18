const form = document.getElementById('adoptionForm');
const submitBtn = document.getElementById('submit');
const successMsg = document.getElementById('successMsg');

// ตรวจสอบทุก input/textarea เพื่อเปลี่ยนสีปุ่ม submit
function checkInputs() {
    let allFilled = true;

    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (!input.checked) allFilled = false;
        } else if (input.type === 'radio') {
            const radios = form.querySelectorAll(`input[name="${input.name}"]`);
            if (!Array.from(radios).some(r => r.checked)) allFilled = false;
        } else if (input.type === 'file') {
            if (!input.files[0]) allFilled = false;
        } else {
            if (input.value.trim() === '') allFilled = false;
        }
    });

    // อัปเดตปุ่ม submit
    if (allFilled) {    //เมื่อใส่ input ครบทุกช่อง
        submitBtn.style.backgroundColor = '#ffc107';
        submitBtn.disabled = false;
        submitBtn.classList.add('enabled');     // เพิ่ม class เพื่อใช้ hover
    } else {
        submitBtn.style.backgroundColor = 'rgb(165, 159, 159)';
        submitBtn.disabled = true;
        submitBtn.classList.remove('enabled');
    }
}

// ตรวจสอบทุกครั้งที่ผู้ใช้พิมพ์หรือเปลี่ยนค่า
form.addEventListener('input', checkInputs);
form.addEventListener('change', checkInputs);   // สำหรับ checkbox / radio

// ตรวจสอบข้อมูล + แสดง Error message + ส่งข้อมูล + Pop up
form.addEventListener('submit', function(event) {
    event.preventDefault();
    let valid = true;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        const errorEl = document.getElementById(input.id + 'Error');
        if (errorEl) errorEl.textContent = '';

        if (input.type === 'text' || input.type === 'textarea') {
            if (input.value.trim() === '') {
                errorEl.textContent = 'Please fill out this field.';
                valid = false;
            }
        } else if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                errorEl.textContent = 'Please enter a valid email address.';
                valid = false;
            }
        } else if (input.type === 'tel') {
            const phonePattern = /^[0-9]{9,10}$/;
            if (!phonePattern.test(input.value.trim())) {
                errorEl.textContent = 'Please enter a 9-10 digit phone number.';
                valid = false;
            }
        } else if (input.type === 'date') {
            if (!input.value) {
                errorEl.textContent = 'Please select a date.';
                valid = false;
            }
        } else if (input.type === 'file') {
            const file = input.files[0];
            if (!file) {
                errorEl.textContent = 'Please attach the file.';
                valid = false;
            }
        } else if (input.type === 'checkbox') {
            if (!input.checked) {
                errorEl.textContent = 'Please tick the box.';
                valid = false;
            }
        } else if (input.type === 'radio') {
            const radios = form.querySelectorAll(`input[name="${input.name}"]`);
            if (!Array.from(radios).some(r => r.checked)) {
                const radioErrorEl = document.getElementById(input.name + 'Error');
                if (radioErrorEl) radioErrorEl.textContent = 'Please select an option.';
                valid = false;
            }
        }
    });

    if (!valid) return;

    // ส่งฟอร์ม
    const formData = new FormData(form);
    fetch('/api/submitAdoption', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // แสดงป๊อปอัพ
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = 'white';
        popup.style.padding = '20px';
        popup.style.border = '2px solid black';
        popup.innerHTML = `
        <p>Form submitted successfully!</p>
        <button id="goHome">Back to Homepage</button>
        `;
        document.body.appendChild(popup);

        document.getElementById('goHome').addEventListener('click', () => {
        window.location.href = '/homepage.html'; // กลับ homepage
        });
    })
    .catch(err => console.error(err));
});