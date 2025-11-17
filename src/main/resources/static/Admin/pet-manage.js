// Redirect กลับหน้าแรกถ้าไม่ได้ล็อกอินหรือไม่ใช่ ADMIN
(function enforceAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      window.location.href = '/index.html';
    }
  } catch (_) {
    window.location.href = '/index.html';
  }
})();