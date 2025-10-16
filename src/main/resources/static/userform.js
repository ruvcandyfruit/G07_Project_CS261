const form = document.getElementById('adoptionForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    
    const fields = ['firstName', 'lastName', 'age', 'phone', 'identityDoc', 'addressDoc', 'reason', 'address', 'occupation'];
    fields.forEach(field => {
        const errorEl = document.getElementById(field + 'Error');
        if (errorEl) errorEl.textContent = '';
    });
    successMsg.style.display = 'none';

    let valid = true;

    // === ตรวจสอบค่าแต่ละช่อง ===

    // ชื่อ
    if (form.firstName.value.trim() === '') {
        document.getElementById('firstNameError').textContent = 'กรุณากรอกชื่อ';
        valid = false;
    }

    // นามสกุล
    if (form.lastName.value.trim() === '') {
        document.getElementById('lastNameError').textContent = 'กรุณากรอกนามสกุล';
        valid = false;
    }

    // อายุ
    const ageVal = parseInt(form.age.value);
    if (!ageVal || ageVal < 1 || ageVal > 120) {
        document.getElementById('ageError').textContent = 'กรุณากรอกอายุที่ถูกต้อง (1-120 ปี)';
        valid = false;
    }

    // เบอร์โทรศัพท์
    const phoneVal = form.phone.value.trim();
    const phonePattern = /^[0-9]{9,10}$/;
    if (!phonePattern.test(phoneVal)) {
        document.getElementById('phoneError').textContent = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (9-10 ตัวเลข)';
        valid = false;
    }

    // ตรวจสอบไฟล์แนบเอกสาร (identityDoc)
    const identityFile = form.identityDoc.files[0];
    if (!identityFile) {
        document.getElementById('identityDocError').textContent = 'กรุณาแนบไฟล์เอกสาร';
        valid = false;
    } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(identityFile.type)) {
        document.getElementById('identityDocError').textContent = 'รองรับเฉพาะไฟล์ PDF, JPG, PNG';
        valid = false;
    } else if (identityFile.size > 5 * 1024 * 1024) {
        document.getElementById('identityDocError').textContent = 'ไฟล์ต้องไม่เกิน 5MB';
        valid = false;
    }

    // ตรวจสอบไฟล์แนบที่อยู่ (addressDoc)
    const addressFile = form.addressDoc.files[0];
    if (!addressFile) {
        document.getElementById('addressDocError').textContent = 'กรุณาแนบไฟล์หลักฐานที่อยู่';
        valid = false;
    } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(addressFile.type)) {
        document.getElementById('addressDocError').textContent = 'รองรับเฉพาะไฟล์ PDF, JPG, PNG';
        valid = false;
    } else if (addressFile.size > 5 * 1024 * 1024) {
        document.getElementById('addressDocError').textContent = 'ไฟล์ต้องไม่เกิน 5MB';
        valid = false;
    }

    // เหตุผล
    if (form.reason.value.trim() === '') {
        document.getElementById('reasonError').textContent = 'กรุณากรอกเหตุผล';
        valid = false;
    }

    // ที่อยู่
    if (form.address.value.trim() === '') {
        document.getElementById('addressError').textContent = 'กรุณากรอกที่อยู่ตามทะเบียนบ้าน';
        valid = false;
    }

    // อาชีพ
    if (form.occupation.value.trim() === '') {
        document.getElementById('occupationError').textContent = 'กรุณากรอกอาชีพ';
        valid = false;
    }

    if (!valid) return;

    // === ส่งฟอร์ม ===
    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            successMsg.style.display = 'block';
            form.reset();
        } else {
            alert('เกิดข้อผิดพลาดในการส่ง กรุณาลองใหม่');
        }
    })
    .catch(error => {
        alert('เกิดข้อผิดพลาด: ' + error.message);
    });
});

// ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบทุกช่องก่อนจะสามารถกดปุ่ม submit ได้
const submitBtn = document.getElementById('submit');

function checkInputs() {
  const inputs = form.querySelectorAll(
  'input[required], textarea[required], input[type="checkbox"][required]'
);

    let allFilled = true;

    inputs.forEach(input => {
    if (input.type === 'checkbox') {
        if (!input.checked) allFilled = false; // ถ้า checkbox ไม่ถูกติ้ก → false
    } else {
        if (input.value.trim() === '') allFilled = false; // สำหรับ input/textarea
    }
    });

    if (allFilled) {
        submitBtn.style.backgroundColor = '#ffc107'; // สีปกติเมื่อครบ
        submitBtn.disabled = false;
        submitBtn.classList.add('enabled'); // เพิ่ม class เพื่อใช้ hover
    } else {
        submitBtn.style.backgroundColor = 'gray';
        submitBtn.disabled = true;
        submitBtn.classList.remove('enabled');
    }
}

// ตรวจสอบทุกครั้งที่ผู้ใช้พิมพ์
form.addEventListener('input', checkInputs);
form.addEventListener('change', checkInputs); // สำหรับ checkbox