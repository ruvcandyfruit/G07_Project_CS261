// Mock API data ไว้เทสก่อนเรียก API ของจริง
const mockAPIData = {
    pending: {
        status: "pending",
        user: {
            username: "สมชาย ใจดี",
            email: "somchai@example.com"
        },
        firstName: "สมชาย",
        lastName: "ใจดี",
        birthDate: "15/05/1990",
        phone: "081-234-5678",
        email: "somchai@example.com",
        occupation: "วิศวกรซอฟต์แวร์",
        address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
        residenceType: "คอนโด",
        experience: "เคยเลี้ยงแมวมา 2 ตัว เป็นเวลา 5 ปี แมวทั้งสองตัวมีสุขภาพแข็งแรงและได้รับการดูแลเป็นอย่างดี",
        reason: "รักและชอบสัตว์มาก ต้องการมีเพื่อนเลี้ยงในบ้านเพื่อลดความเหงา และพร้อมที่จะดูแลอย่างเต็มที่"
    },
    approved: {
        status: "approved",
        user: {
            username: "สมหญิง รักสัตว์",
            email: "somying@example.com"
        },
        firstName: "สมหญิง",
        lastName: "รักสัตว์",
        birthDate: "20/08/1988",
        phone: "089-876-5432",
        email: "somying@example.com",
        occupation: "ครู",
        address: "456 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
        residenceType: "บ้านเดี่ยว",
        experience: "เลี้ยงสุนัขและแมวมาตลอด มีประสบการณ์ดูแลสัตว์ป่วยและพาไปพบสัตวแพทย์เป็นประจำ",
        reason: "อยากให้ความรักและบ้านที่อบอุ่นแก่สัตว์ที่ต้องการ มีเวลาและพร้อมดูแลอย่างเต็มที่"
    }
};

// API Configuration
const API_BASE_URL = 'https://your-api-domain.com/api'; // เปลี่ยนเป็น URL จริงของคุณ

// Fetch data from real API
async function fetchUserFormFromAPI(formID) {
    const response = await fetch(`${API_BASE_URL}/form/${formID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer YOUR_TOKEN' // ถ้ามี authentication
        }
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
}

// Get user form with fallback to mock data
async function getUserForm(formID) {
    try {
        console.log('🔄 กำลังเรียก API...');
        const data = await fetchUserFormFromAPI(formID);
        console.log('✅ เรียก API สำเร็จ:', data);
        return data;
    } catch (error) {
        console.warn('⚠️ เรียก API ไม่สำเร็จ:', error.message);
        console.log('📦 ใช้ Mock Data แทน');
        
        // Fallback to mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockAPIData[formID] || mockAPIData.pending);
            }, 500);
        });
    }
}

// Get formID from URL parameter or use default
const urlParams = new URLSearchParams(window.location.search);
const formID = urlParams.get('formId') || 'pending';

// Load form data
async function loadFormData() {
    try {
        const data = await getUserForm(formID);
        
        // Populate user info
        document.getElementById('userName').textContent = data.user.username;
        document.getElementById('userEmail').textContent = data.user.email;

        // Populate form fields
        document.getElementById('firstName').value = data.firstName;
        document.getElementById('lastName').value = data.lastName;
        document.getElementById('birthDate').value = data.birthDate;
        document.getElementById('phone').value = data.phone;
        document.getElementById('email').value = data.email;
        document.getElementById('occupation').value = data.occupation;
        document.getElementById('address').value = data.address;
        document.getElementById('residenceType').value = data.residenceType;
        document.getElementById('experience').value = data.experience;
        document.getElementById('reason').value = data.reason;

        // Check status and set form mode
        const isPending = data.status === 'pending';
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        const submitBtn = document.getElementById('submitBtn');
        const backBtn = document.getElementById('backBtn');
        
        // บรรทัดนี้ทำให้ทุก input เป็น disabled
        formInputs.forEach(input => input.disabled = true);

        if (isPending) {
            // Enable editing
            submitBtn.style.display = 'block';
            submitBtn.textContent = 'แก้ไข';
            submitBtn.type = 'button';
                    
            // Redirect to edit page when click edit button
            submitBtn.onclick = function() {
                window.location.href = `userform.html?formId=${formID}`;
            };
        } else {
            // Disable editing
            formInputs.forEach(input => input.disabled = true);
            submitBtn.style.display = 'none';
        }

        // Show form
        document.getElementById('loading').style.display = 'none';
        document.getElementById('formContent').style.display = 'block';

    } catch (error) {
        document.getElementById('loading').textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
    }
}

// Handle back button
document.getElementById('backBtn').addEventListener('click', function() {
    window.history.back();
});

// Load data on page load
loadFormData();

// Instructions for testing:
// Add ?formId=pending to URL for editable form (pending status)
// Add ?formId=approved to URL for read-only form (approved status)
// Example: yourpage.html?formId=12345