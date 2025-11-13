/*
ส่วนที่ต้อง fetch API -> Calendar card, Notification card
เปลี่ยน highlightDays(วันที่มีนัดหมาย) ตามที่ fetch api มา
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
        
        // 3. เด้งไปหน้าตาม id
        const itemId = this.id;
        
        if (itemId === 'nav-dashboard') {
            window.location.href = 'dashboard.html';
        } else if (itemId === 'nav-all-pet') {
            window.location.href = 'allpet.html';
        } else if (itemId === 'nav-schedule') {
            window.location.href = 'schedule.html';
        } else if (itemId === 'nav-logout') {
            window.location.href = '../login.html'
        }
        // ถ้าเป็น logout ก็ไม่ไปไหน (หรือจะเพิ่มการ logout ได้)
    });
});

// ---------- Function สำหรับแสดงสถิติต่างๆจาก API ใส่ใน Stat list card ----------
// สามารถเปลี่ยนไปใช้ API จริงได้ที่ด้านล่าง
const MOCK_FORM_DATA = {
    forms: [
        { id: "1", status: "pending" },
        { id: "2", status: "pending" },
        { id: "3", status: "pending" },
        { id: "4", status: "approve" },
        { id: "5", status: "approve" },
        { id: "6", status: "delivered" },
        { id: "7", status: "delivered" }
    ]
};

const MOCK_PET_DATA = {
    pets: [
        { id: "1", status: "open" },
        { id: "2", status: "open" },
        { id: "3", status: "open" },
        { id: "4", status: "open" },
        { id: "5", status: "open" },
        { id: "6", status: "open" },
        { id: "7", status: "open" },
        { id: "8", status: "open" },
        { id: "9", status: "open" },
        { id: "10", status: "open" },
        { id: "11", status: "open" },
        { id: "12", status: "closed" },
        { id: "13", status: "closed" },
        { id: "14", status: "closed" },
        { id: "15", status: "closed" },
        { id: "16", status: "closed" }
    ]
};

const MOCK_USER_DATA = {
    userId: "12",
    username: "admin",
    email: "admin@example.com"
};

// ฟังก์ชันสำหรับ fetch Form API
async function fetchFormStats(useMockData = true) {
    try {
        let data;
        
        if (useMockData) {
            console.log('Using mock form data...');
            data = MOCK_FORM_DATA;
        } else {
            try {
                const response = await fetch('/api/forms');
                if (!response.ok) throw new Error('API request failed');
                data = await response.json();
            } catch (apiError) {
                console.warn('Form API fetch failed, falling back to mock data:', apiError);
                data = MOCK_FORM_DATA;
            }
        }
        
        // นับจำนวนแต่ละสถานะ
        const pendingCount = data.forms.filter(form => form.status === 'pending').length;
        const waitingCount = data.forms.filter(form => form.status === 'approve').length;
        const deliveredCount = data.forms.filter(form => form.status === 'delivered').length;
        
        return {
            pending: pendingCount,
            waiting: waitingCount,
            delivered: deliveredCount
        };
        
    } catch (error) {
        console.error('Error fetching form stats:', error);
        return { pending: 0, waiting: 0, delivered: 0 };
    }
}

// ฟังก์ชันสำหรับ fetch Pet API
async function fetchPetStats(useMockData = true) {
    try {
        let data;
        
        if (useMockData) {
            console.log('Using mock pet data...');
            data = MOCK_PET_DATA;
        } else {
            try {
                const response = await fetch('/api/pets');
                if (!response.ok) throw new Error('API request failed');
                data = await response.json();
            } catch (apiError) {
                console.warn('Pet API fetch failed, falling back to mock data:', apiError);
                data = MOCK_PET_DATA;
            }
        }
        
        // นับจำนวนแต่ละสถานะ
        const openCount = data.pets.filter(pet => pet.status === 'open').length;
        const closedCount = data.pets.filter(pet => pet.status === 'closed').length;
        
        return {
            open: openCount,
            closed: closedCount
        };
        
    } catch (error) {
        console.error('Error fetching pet stats:', error);
        return { open: 0, closed: 0 };
    }
}

// ฟังก์ชันสำหรับ fetch User API
async function fetchUserStats(useMockData = true) {
    try {
        let data;
        
        if (useMockData) {
            console.log('Using mock user data...');
            data = MOCK_USER_DATA;
        } else {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) throw new Error('API request failed');
                data = await response.json();
            } catch (apiError) {
                console.warn('User API fetch failed, falling back to mock data:', apiError);
                data = MOCK_USER_DATA;
            }
        }
        
        return {
            userId: data.userId
        };
        
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { userId: '0' };
    }
}

// ฟังก์ชันสำหรับอัพเดทตัวเลขใน HTML
function updateStatsDisplay(formStats, petStats, userStats) {
    // อัพเดท Form Stats
    document.getElementById('stat-pending').textContent = formStats.pending;
    document.getElementById('stat-waiting').textContent = formStats.waiting;
    document.getElementById('stat-delivered').textContent = formStats.delivered;
    
    // อัพเดท Pet Stats
    document.getElementById('stat-open').textContent = petStats.open;
    document.getElementById('stat-closed').textContent = petStats.closed;
    
    // อัพเดท User Stats
    document.getElementById('stat-user-id').textContent = userStats.userId;
}

// ฟังก์ชันหลักสำหรับโหลดสถิติทั้งหมด
async function loadDashboardStats(useMockData = true) {
    try {
        // แสดง loading state (ถ้าต้องการ)
        console.log('Loading dashboard stats...');
        
        // Fetch ข้อมูลจากทุก API พร้อมกัน
        const [formStats, petStats, userStats] = await Promise.all([
            fetchFormStats(useMockData),
            fetchPetStats(useMockData),
            fetchUserStats(useMockData)
        ]);
        
        // อัพเดทการแสดงผล
        updateStatsDisplay(formStats, petStats, userStats);
        
        console.log('Dashboard stats loaded successfully!');
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    // เปลี่ยนเป็น true เพื่อใช้ mock data
    // เปลี่ยนเป็น false เพื่อใช้ API จริง
    loadDashboardStats(true); // ใช้ mock data
    // loadDashboardStats(false); // ใช้ API จริง
});

// ถ้าต้องการ refresh stats ทุกๆ 30 วินาที (optional)
// setInterval(() => loadDashboardStats(true), 30000);

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

// ---------- Function สำหรับแสดงวันที่นัดหมายจาก API ใส่ใน Calendar card ----------

// มี Mock Data สำหรับทดสอบ สามารถเปลี่ยนไปใช้ API ได้ข้างล่าง
const MOCK_CALENDAR_DATA = {    // เปลี่ยนให้หน่อย
    year: 2025,
    month: 10, // November (0-11, โดย 0=Jan, 10=Nov, 11=Dec)
    appointments: [
        { day: 5, title: 'นัดส่งมอบน้องบราวนี่ให้คุณสมชาย' },
        { day: 12, title: 'นัดส่งมอบน้องมิวมิวให้คุณสมหญิง' },
        { day: 18, title: 'นัดตรวจสุขภาพน้องลัคกี้' },
        { day: 25, title: 'นัดส่งมอบน้องบอสให้คุณสมพร' },
        { day: 28, title: 'นัดพบสัตวแพทย์' }
    ]
};

async function fetchAppointments(useMockData = false) {
    try {
        let data;
        
        if (useMockData) {
            // ใช้ Mock Data
            console.log('Using mock data for calendar...');
            data = MOCK_CALENDAR_DATA;
        } else {
            // เรียก API จริง
            try {
                const response = await fetch('YOUR_API_URL'); // เปลี่ยนเป็น URL ของคุณ
                if (!response.ok) throw new Error('API request failed');
                data = await response.json();
            } catch (apiError) {
                console.warn('API fetch failed, falling back to mock data:', apiError);
                data = MOCK_CALENDAR_DATA;
            }
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return MOCK_CALENDAR_DATA;
    }
}

// Generate Calendar with API data
async function generateCalendar(useMockData = true) {
    const calendarDays = document.getElementById('calendar-days');
    const calendarMonthElement = document.getElementById('calendar-month');
    
    // ดึงข้อมูลจาก API หรือ Mock Data
    const appointmentData = await fetchAppointments(useMockData);
    
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
                window.location.href = 'schedule.html';
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
    // เปลี่ยนเป็น true เพื่อใช้ mock data
    // เปลี่ยนเป็น false เพื่อใช้ API จริง
    generateCalendar(true); // ใช้ mock data
    
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
});



// ---------- Function สำหรับแสดงแจ้งเตือนคำขอรับเลี้ยงจาก API ใส่ใน Notification card ----------

// Mock Data สำหรับทดสอบ
const MOCK_DATA = {
    forms: [
        {
            id: "1",
            status: "pending",
            requesterName: "คุณสมชาย ใจดี",
            petType: "สุนัข",
            petName: "บราวนี่",
            appointmentDate: "2024-12-20",
            appointmentTime: "14:00",
            isRead: false
        },
        {
            id: "2",
            status: "pending",
            requesterName: "คุณสมหญิง รักสัตว์",
            petType: "แมว",
            petName: "มิวมิว",
            appointmentDate: "2024-12-22",
            appointmentTime: "10:30",
            isRead: false
        },
        {
            id: "3",
            status: "cancel",
            requesterName: "คุณสมศักดิ์ ศรีสุข",
            petType: "สุนัข",
            petName: "ลัคกี้",
            appointmentDate: "2024-12-15",
            appointmentTime: "15:00",
            isRead: true
        },
        {
            id: "4",
            status: "approve",
            requesterName: "คุณสมใจ มีเมตตา",
            petType: "แมว",
            petName: "โออิชิ",
            appointmentDate: new Date().toISOString().split('T')[0], // วันนี้
            appointmentTime: "13:00",
            isRead: false
        },
        {
            id: "5",
            status: "approve",
            requesterName: "คุณสมพร รักษ์สัตว์",
            petType: "สุนัข",
            petName: "บอส",
            appointmentDate: "2024-12-25",
            appointmentTime: "11:00",
            isRead: true
        }
    ]
};

// ฟังก์ชันสำหรับเช็คว่าเป็นวันนี้หรือไม่
function isToday(dateString) {
    const today = new Date();
    const checkDate = new Date(dateString);
    
    return today.getFullYear() === checkDate.getFullYear() &&
           today.getMonth() === checkDate.getMonth() &&
           today.getDate() === checkDate.getDate();
}

// ฟังก์ชันสำหรับสร้าง HTML ของ notification item
function createNotificationHTML(form) {
    let iconSrc = '';
    let title = '';
    let message = '';
    let notificationId = '';
    
    // กำหนด template ตามสถานะ
    if (form.status === 'pending') {
        iconSrc = 'image-resources/allpet-icon.svg';
        title = 'คำขอรับเลี้ยงใหม่';
        message = `มีคำขอรับเลี้ยงใหม่มาจาก ${form.requesterName} สำหรับน้อง${form.petType} ${form.petName}`;
        notificationId = 'new-request';
        
    } else if (form.status === 'cancel') {
        iconSrc = 'image-resources/cancel-icon.svg';
        title = 'ผู้ใช้ยกเลิกคำขอ';
        message = `${form.requesterName} ได้ยกเลิกคำขอของ${form.petType} ${form.petName} แล้ว`;
        notificationId = 'cancel-request';
        
    } else if (form.status === 'approve') {
        if (isToday(form.appointmentDate)) {
            iconSrc = 'image-resources/appointmentEnded-icon.svg';
            title = 'นัดหมายสิ้นสุดแล้ว';
            message = `การนัดหมายกับ ${form.requesterName} สำหรับน้อง${form.petType} ${form.petName} ได้สิ้นสุดแล้ว โปรดยืนยันสถานะการส่งมอบ`;
            notificationId = 'appointment-ended';
        } else {
            iconSrc = 'image-resources/time-icon.svg';
            title = 'แจ้งเตือนวันนัดหมายใกล้มาถึง';
            message = `นัดหมายส่งมอบน้อง${form.petType} ${form.petName} ให้ ${form.requesterName} พรุ่งนี้ ${form.appointmentTime}`;
            notificationId = 'appointment-noti';
        }
    }
    
    // สร้าง HTML element
    const readClass = form.isRead ? 'read' : 'warning';
    
    return `
        <div class="notification-item ${readClass}" data-notification-id="${notificationId}" data-form-id="${form.id}">
            <img src="${iconSrc}" alt="notification icon">   
            <div class="notification-item-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
}

// ฟังก์ชันสำหรับนับจำนวน notification ที่ยังไม่ได้อ่าน
function updateNotificationBadge() {
    const unreadItems = document.querySelectorAll('.notification-item.warning').length;
    const badge = document.getElementById('notification-count');
    
    if (unreadItems > 0) {
        badge.textContent = unreadItems;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

// ฟังก์ชันสำหรับทำเครื่องหมายว่าอ่านแล้วและเด้งไปหน้ารายละเอียด
function markAsReadAndRedirect(notificationElement, formId) {
    // เปลี่ยนสถานะ UI
    notificationElement.classList.remove('warning');
    notificationElement.classList.add('read');
    
    // อัพเดท badge
    updateNotificationBadge();
    
    // ส่ง request ไป API เพื่ออัพเดทสถานะ (ถ้ามี)
    // fetch(`/api/notifications/${formId}/read`, { method: 'PATCH' });
    
    // เด้งไปหน้ารายละเอียดพร้อม form id
    window.location.href = `request-status.html?id=${encodeURIComponent(formId)}`;
}

// ฟังก์ชันหลักสำหรับ fetch และแสดงผล notifications
async function loadNotifications(useMockData = false) {
    try {
        let data;
        
        if (useMockData) {
            // ใช้ Mock Data
            console.log('Using mock data for testing...');
            data = MOCK_DATA;
        } else {
            // เรียก API (แก้ URL ตามจริง)
            try {
                const response = await fetch('/api/forms');
                if (!response.ok) throw new Error('API request failed');
                data = await response.json();
            } catch (apiError) {
                console.warn('API fetch failed, falling back to mock data:', apiError);
                data = MOCK_DATA;
            }
        }
        
        // สร้าง HTML สำหรับทุก notification
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = '';
        
        data.forms.forEach(form => {
            const notificationHTML = createNotificationHTML(form);
            notificationList.innerHTML += notificationHTML;
        });
        
        // อัพเดท badge
        updateNotificationBadge();
        
        // เพิ่ม event listener ให้กับทุก notification item
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', function() {
                const formId = this.getAttribute('data-form-id');
                markAsReadAndRedirect(this, formId);
            });
        });
        
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
// เปลี่ยนเป็น true ถ้าต้องการใช้ mock data
document.addEventListener('DOMContentLoaded', () => {
    loadNotifications(true); // ใช้ mock data
    // loadNotifications(false); // ใช้ API จริง
});

// ถ้าต้องการ refresh notification ทุกๆ 30 วินาที (optional)
// setInterval(() => loadNotifications(true), 30000);
