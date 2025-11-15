const form = document.getElementById('adoptionForm');
const submitBtn = document.getElementById('submit');
const successMsg = document.getElementById('successMsg');

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const params = new URLSearchParams(window.location.search);
    const petId = params.get("petId");

    if (!user || !user.id) {
        alert("กรุณาเข้าสู่ระบบก่อนกรอกฟอร์ม");
        window.location.href = "login.html";
        return;
    }

    const userIdField = document.getElementById("userId");
    if (userIdField) userIdField.value = user.id;
    console.log("Auto-filled userId:", user.id);

    if (petId) {
        // Set hidden field value
        const petIdField = document.getElementById("petId");
        if (petIdField) petIdField.value = petId;
        console.log("Auto-filled petId:", petId);
    } else {
        alert("ไม่พบข้อมูลของสัตว์ กรุณากลับไปเลือกใหม่อีกครั้ง");
        window.location.href = "petlisting.html";
    }

    checkInputs();
});

    function checkInputs() {
        let allFilled = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        // 1. รวบรวมชื่อกลุ่ม Radio ที่มี required
        const radioNames = new Set();
        form.querySelectorAll('input[type="radio"][required]').forEach(radio => radioNames.add(radio.name));

        inputs.forEach(input => {
            // ข้าม radio buttons เพราะเราจัดการเป็นกลุ่ม
            if (input.type === 'radio') return;

            if (input.type === 'checkbox') {
                if (!input.checked) allFilled = false;
            } else if (input.type === 'file') {
                if (!input.files[0]) allFilled = false;
            } else if (input.tagName.toLowerCase() === 'textarea' || input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'date') {
                if (input.value.trim() === '') allFilled = false;
            }
        });

        // 2. ตรวจสอบ Radio Button Groups
        radioNames.forEach(name => {
            const radios = form.querySelectorAll(`input[name="${name}"]`);
            if (!Array.from(radios).some(r => r.checked)) {
                allFilled = false;
            }
        });


        if (allFilled) {
            submitBtn.style.backgroundColor = '#ffc107';
            submitBtn.disabled = false;
            submitBtn.classList.add('enabled');
        } else {
            submitBtn.style.backgroundColor = 'rgb(165, 159, 159)';
            submitBtn.disabled = true;
            submitBtn.classList.remove('enabled');
        }
    }

    form.addEventListener('input', checkInputs);
    form.addEventListener('change', checkInputs);

    // -------------------------------
    // 3) Submit form และ **ปรับปรุงการจัดการ Error**
    // -------------------------------
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let valid = true;

        // 1. รวบรวมชื่อกลุ่ม Radio ที่มี required
        const radioNames = new Set();
        form.querySelectorAll('input[type="radio"][required]').forEach(radio => radioNames.add(radio.name));
        
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            const errorEl = document.getElementById(input.id + 'Error') || document.getElementById(input.name + 'Error');
            if (errorEl) errorEl.textContent = '';
            
            // ข้าม radio buttons
            if (input.type === 'radio') return;

            if (input.type === 'text' || input.tagName.toLowerCase() === 'textarea') {
                if (input.value.trim() === '') {
                    if (errorEl) errorEl.textContent = 'กรุณากรอกข้อมูล'; valid = false;
                }
            } else if (input.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value.trim())) {
                    if (errorEl) errorEl.textContent = 'กรุณากรอกอีเมลให้ถูกต้อง'; valid = false;
                }
            } else if (input.type === 'tel') {
                const phonePattern = /^[0-9]{10}$/;
                if (!phonePattern.test(input.value.trim())) {
                    if (errorEl) errorEl.textContent = 'กรุณากรอกเบอร์โทร 10 หลัก'; valid = false;
                }
            } else if (input.type === 'date') {
                if (!input.value) {
                    if (errorEl) errorEl.textContent = 'กรุณาเลือกวันที่'; valid = false;
                }
            } else if (input.type === 'file') {
                if (!input.files[0]) {
                    if (errorEl) errorEl.textContent = 'กรุณาแนบไฟล์'; valid = false;
                }
            } else if (input.type === 'checkbox') {
                if (!input.checked) {
                    if (errorEl) errorEl.textContent = 'กรุณาติ๊กถูก'; valid = false;
                }
            }
        });

        // 2. ตรวจสอบ Radio Button Groups
        radioNames.forEach(name => {
            const radios = form.querySelectorAll(`input[name="${name}"]`);
            if (!Array.from(radios).some(r => r.checked)) {
                const errorEl = document.getElementById(name + 'Error');
                if (errorEl) errorEl.textContent = 'กรุณาเลือกตัวเลือก';
                valid = false;
            }
        });


        if (!valid) return;

        const formData = new FormData(form);
        fetch("http://localhost:8081/api/userform/submit", {
            method: 'POST',
            body: formData
        })
        .then(async response => {
            // ดึงข้อความทั้งหมดมาเป็น text ก่อน
            const text = await response.text();
            
            if (!response.ok) {
                // ถ้าเกิด Error (ไม่ใช่ Status 200-299)
                let errorMessage = `Error ${response.status}: Server error.`;
                try {
                    // พยายามดึง message จาก JSON (ถ้า Server ตอบเป็น JSON)
                    const data = JSON.parse(text);
                    // ใช้ message จาก JSON ถ้ามี หรือใช้ข้อความ Status Code และเนื้อหาตอบกลับ
                    errorMessage = data.message || `Error ${response.status}: ${text}`;
                } catch (e) {
                    // ถ้า Server ตอบเป็นข้อความธรรมดา (เช่น "File upload error: ...")
                    errorMessage = text || `Error ${response.status}: Server sent empty error response.`;
                }
                // โยน Error เพื่อให้ไปเข้า .catch()
                throw new Error(errorMessage);
            }
            
            // ถ้าสำเร็จ ให้แปลงเป็น JSON เพื่อใช้งานต่อ
            try { return JSON.parse(text); } 
            catch { return { message: 'Form submitted successfully, but response not JSON.' }; }
        })
        .then(data => {
            console.log("Server response: ", data);
            showPopup('success');
        })
        .catch(err => {
            console.error("Error:", err);
            // ส่งข้อความ Error ที่ได้จาก Server หรือ Network ไปแสดงใน popup
            showPopup('error', err.message); 
        });
    });

    // -------------------------------
    // 4) Function to handle popup (ปรับปรุงการแสดง Error Detail)
    // -------------------------------
    function showPopup(type, errorDetail = '') {
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('popup');
        const goButton = document.getElementById('goButton');

        // ล้างรายละเอียด error เก่า
        const oldDetailEl = popup.querySelector('.error-detail');
        if (oldDetailEl) oldDetailEl.remove();

        if (type === 'success') {
            popup.querySelector('h1').textContent = 'ส่งคำขอรับเลี้ยงสัตว์สำเร็จ !';
            goButton.style.display = 'flex';
        } else {
            popup.querySelector('h1').textContent = 'ส่งคำขอไม่สำเร็จ \n กรุณาลองอีกครั้ง !';
            if (errorDetail) {
                // เพิ่มรายละเอียด error เข้าไปใน popup
                const detailEl = document.createElement('p');
                detailEl.className = 'error-detail';
                detailEl.style.color = 'red';
                detailEl.style.whiteSpace = 'pre-wrap'; // ทำให้ขึ้นบรรทัดใหม่ได้
                detailEl.textContent = `รายละเอียด: ${errorDetail}`;
                popup.appendChild(detailEl);
            }
            goButton.style.display = 'none';
        }

        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        const close = document.getElementById('close');
        close.onclick = () => {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            // ตรวจสอบว่ามี error detail ไหมก่อนลบ
            const detailEl = popup.querySelector('.error-detail');
            if (detailEl) detailEl.remove();
        };

        if (type === 'success') {
            document.getElementById('goHome').onclick = () => {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                window.location.href = '/index.html';
            };
            document.getElementById('goStatus').onclick = () => {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                window.location.href = '/User/status.html';
            };
        }
    }
