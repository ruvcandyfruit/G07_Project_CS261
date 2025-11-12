/*
ส่วนที่ต้อง fetch API
- pet stat card
- calendar card
- notification card
NOTE line chart ไม่ใช้ API ไม่มีข้อมูลมาทำ

===== Pet stat card ====
- id="DoughnutChart" เจนมานิดหน่อย อยู่ในคอมเม้นท์ที่ chart.js
ตัวอย่าง JSON สำหรับทำกราฟโดนัท
{
    "labels": ["สุนัข", "แมว"],
    "data": [9, 7]
}
จำนวนต่างๆของ
- id="stat-pending
- id="stat-waiting"
- id="stat-delivered"
- id="stat-open"
- id="stat-closed"
- id="stat-user-id"

===== calendar card ====
เปลี่ยน highlightDays ตามที่ fetch api มา

===== notification card ====
ดึงมาทุก form แต่ต้องมีข้อมูลของ pet ติดมาด้วย 
แจ้งเตือนมี 4 แบบ ถ้า form สถานะไหน -> ให้แสดงแจ้งเตือนแบบนั้นๆ พร้อมใส่ข้อมูลที่กำหนด
- status=pending -> show id="new-request"
- status=cancel -> show id="cancel-request"
- status=approve && date!=TODAY -> show id="appointment-noti"
- status=approve && date==TODAY -> show id="appointment-ended"
*/

// Side menu bar
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // 1. ลบ 'active' ออกจากทุกรายการ
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        // 2. ถ้าไม่เป็นปุ่ม 'logout' ให้เพิ่ม 'active'
        if (!this.classList.contains('logout')) {
            this.classList.add('active');
        }
    });
});

// Generate Calendar
function generateCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const daysInMonth = 30;
    const startDay = 6; // April 2025 starts on Tuesday (0=Sun, 1=Mon, 2=Tue)
    const highlightDays = [1, 9, 20];

    calendarDays.innerHTML = '';

    // Add empty cells for days before the month starts
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.id = `calendar-day-${day}`;
        
        if (highlightDays.includes(day)) {
            dayElement.classList.add('highlight');
        }

        dayElement.addEventListener('click', function() {
            console.log(`Clicked day: ${day}`);
        });

        calendarDays.appendChild(dayElement);
    }
}

// Update time
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('calendar-current-time').textContent = timeString;
}

// Initialize
window.addEventListener('load', function() {
    generateCalendar();
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
});

// ---------- Function สำหรับดึงข้อมูลนัดหมายจาก API ใส่ใน calendar card ----------
/*
async function fetchAppointments() {
    try {
        const response = await fetch('YOUR_API_URL'); // เปลี่ยนเป็น URL ของคุณ
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        // ข้อมูลทดสอบกรณี API ไม่ทำงาน
        return {
            year: 2025,
            month: 11, // November (0-11, โดย 0=Jan, 11=Dec)
            appointments: [
                { day: 5, title: 'ตรวจสุขภาพสุนัข' },
                { day: 12, title: 'ฉีดวัคซีนแมว' },
                { day: 18, title: 'นัดพบสัตวแพทย์' },
                { day: 25, title: 'ตัดขนสุนัข' }
            ]
        };
    }
}

// Generate Calendar with API data
async function generateCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const calendarMonthElement = document.getElementById('calendar-month');
    
    // ดึงข้อมูลจาก API
    const appointmentData = await fetchAppointments();
    
    const year = appointmentData.year;
    const month = appointmentData.month; // 0-11
    const appointmentDays = appointmentData.appointments.map(apt => apt.day);
    
    // คำนวณจำนวนวันในเดือนและวันแรกของเดือน
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    
    // อัพเดทชื่อเดือนและปี
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // ล้างปฏิทินเก่า
    calendarDays.innerHTML = '';

    // เพิ่มช่องว่างสำหรับวันก่อนเดือนเริ่ม
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarDays.appendChild(emptyDay);
    }

    // เพิ่มวันในเดือน
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.id = `calendar-day-${day}`;
        
        // ตรวจสอบว่าวันนี้มีนัดหมายหรือไม่
        if (appointmentDays.includes(day)) {
            dayElement.classList.add('highlight');
            dayElement.title = getAppointmentTitle(appointmentData.appointments, day);
        }
        
        // ตรวจสอบว่าเป็นวันปัจจุบันหรือไม่
        const today = new Date();
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }

        // Event เมื่อคลิกที่วัน
        dayElement.addEventListener('click', function() {
            const appointment = appointmentData.appointments.find(apt => apt.day === day);
            if (appointment) {
                console.log(`วันที่ ${day}: ${appointment.title}`);
                alert(`นัดหมายวันที่ ${day}\n${appointment.title}`);
            } else {
                console.log(`คลิกวันที่: ${day} (ไม่มีนัดหมาย)`);
            }
        });

        calendarDays.appendChild(dayElement);
    }
}

// Function ช่วยในการหาชื่อนัดหมายของวันที่
function getAppointmentTitle(appointments, day) {
    const appointment = appointments.find(apt => apt.day === day);
    return appointment ? appointment.title : '';
}

// Update time
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('calendar-current-time').textContent = timeString;
}

// Initialize
window.addEventListener('load', function() {
    generateCalendar();
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
});
*/

// Notification clicks
document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', function() {
        const notificationId = this.getAttribute('data-notification-id');
        console.log(`Notification ${notificationId} clicked`);
    });
});