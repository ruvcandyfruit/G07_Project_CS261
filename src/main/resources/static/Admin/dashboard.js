// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        if (!this.classList.contains('logout')) {
            this.classList.add('active');
        }
    });
});

// Generate Calendar
function generateCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const daysInMonth = 30;
    const startDay = 2; // April 2025 starts on Tuesday (0=Sun, 1=Mon, 2=Tue)
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

// Draw Line Chart
function drawLineChart() {
    const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const data = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        addPet: [18, 17, 16, 15, 14, 12, 10, 8, 7, 5, 3, 2],
        request: [2, 3, 5, 5, 7, 8, 10, 12, 15, 19, 17, 10],
        adopted: [0, 0, 0, 0, 0, 5, 7, 9, 11, 14, 18, 15]
    };

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = 20;

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();

        // Y-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText((maxValue - (maxValue / 4) * i).toString(), padding - 10, y + 4);
    }

    // Draw lines
    function drawLine(data, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / 11) * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();

        // Draw points
        data.forEach((value, index) => {
            const x = padding + (chartWidth / 11) * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawLine(data.addPet, '#ffd700');
    drawLine(data.request, '#5cd6d6');
    drawLine(data.adopted, '#2196F3');

    // Draw X-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    data.months.forEach((month, index) => {
        const x = padding + (chartWidth / 11) * index;
        ctx.fillText(month, x, canvas.height - 10);
    });
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
    drawLineChart();
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
});

// Calendar navigation
document.getElementById('calendar-prev').addEventListener('click', function() {
    console.log('Previous month clicked');
    // Implement month navigation
});

document.getElementById('calendar-next').addEventListener('click', function() {
    console.log('Next month clicked');
    // Implement month navigation
});

// Notification clicks
document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', function() {
        const notificationId = this.getAttribute('data-notification-id');
        console.log(`Notification ${notificationId} clicked`);
    });
});