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
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(input.value.trim())) {
                errorEl.textContent = 'Please enter a 10 digit phone number.';
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
    fetch("http://localhost:8081/api/userform/submit", {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = {message: text};
        }
        if (!response.ok) throw new Error(data.message);
        return data;
    })
    // .then(response => response.json())
    .then(data => {
        console.log("Server response: ", data);

        // แสดง overlay
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');
        
        // แสดงข้อความใน popup
        popup.querySelector('h1').textContent = 'ส่งคำขอรับเลี้ยงสัตว์สำเร็จ !';

        // แสดง overlay และ popup
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // ปิด scroll ด้านหลัง

        // ปุ่มกลับหน้า homepage
        document.getElementById('goHome').addEventListener('click', () => {
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            window.location.href = '/index.html';
        });

        // ปุ่มไปดูสถานะคำขอ
        document.getElementById('goStatus').addEventListener('click', () => {
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            window.location.href = '/User/status.html';
        });
    })
    .catch(err => {
        console.error("Error:", err);

        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');

        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // แสดงข้อความ error ใน popup
        popup.querySelector('h1').textContent = 'ส่งคำขอไม่สำเร็จ \n กรุณาลองอีกครั้ง !';
        
        // ปิดการแสดงแถบปุ่ม
        const goButton = document.getElementById('goButton')
        goButton.style.display = 'none';

        // ปิด popup โดยไม่เปลี่ยนหน้า
        const close = document.getElementById('close')
        close.addEventListener('click', () => {
            const overlay = document.getElementById('overlay');
            // ทำให้เหมือนเดิม
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto'; // กลับมา scroll ได้
            goButton.style.display = 'flex';
        });
    });
});