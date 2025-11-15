// โหลด sidebar.html มาใส่
fetch('sidebar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('sidebar').innerHTML = data;

    // --- ใส่ event listener หลังจาก sidebar ถูกใส่เข้า DOM ---
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
                window.location.href = 'ใส่pathโฟลเดอร์/login.html';
            }
        });
    });
});
