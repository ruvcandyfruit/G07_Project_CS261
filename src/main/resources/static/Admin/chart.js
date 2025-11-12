//  ตอนนี้แสดงกราฟแบบสร้างเอง ถ้าเสร็จค่อยเอาไปรวมกับ dashboard.js แยกออกมมาเพื่อดูแค่กราฟง่ายๆ
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
แจ้งเตือนมี 4 แบบ ถ้า form สถานะไหน -> ให้แสดงแจ้งเตือนแบบนั้นๆ พร้อมใส่ข้อมูลที่กำหนด(ชื่อจริงผู้ขอ,ชื่อสัตว์,ชนิดสัตว์,วันนัดหมาย)
- status=pending -> show id="new-request"
- status=cancel -> show id="cancel-request"
- status=approve && date!=TODAY -> show id="appointment-noti"
- status=approve && date==TODAY -> show id="appointment-ended"
*/

//  ------ แบบที่ 1 สร้างกราฟเอง -------
const centerTextPlugin = {
    id: 'centerText', 
    beforeDraw(chart, args, options) {
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        ctx.save();
        
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '20px sans-serif'; 
        ctx.fillStyle = '#666'; 
        ctx.fillText('Total', centerX, centerY - 15); 

        ctx.font = '20px sans-serif'; 
        ctx.fillStyle = '#333'; 
        ctx.fillText(total.toString(), centerX, centerY + 20); 

        ctx.restore();
    }
};

// 2. Function สำหรับสร้าง Doughnut Chart
function createDoughnutChart() {
    const doughnutData = { 
        labels: ['สุนัข', 'แมว'],
        datasets: [{
            label: 'จำนวนสัตว์ตามชนิด',
            data: [9, 7], 
            backgroundColor: ['#010002', '#ffd102'],
            borderColor: 'white', 
            borderWidth: 2, 
            hoverOffset: 4
        }]
    };

    const doughnutConfig = { 
        type: 'doughnut', 
        data: doughnutData,
        options: {
            responsive: true,
            cutout: '80%', 
            rotation: 0, // เริ่มจากขวาบน
            circumference: 360,
            plugins: {
                legend: {
                    position: 'bottom',
                    display: false
                },
                title: {
                    display: false,
                    text: 'สัดส่วนสัตว์เลี้ยงทั้งหมดตามชนิด'
                }
            }
        },
        plugins: [centerTextPlugin] 
    };

    const canvasElement = document.getElementById('DoughnutChart');
    if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        new Chart(ctx, doughnutConfig);
    } else {
        console.error("Canvas element with ID 'DoughnutChart' not found.");
    }
}

// 3. Function สำหรับสร้าง Line Chart
function createLineChart() {
    const lineData = { 
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'จำนวนสัตว์ที่เพิ่มขึ้นต่อปี',
                data: [19, 17, 17, 15, 18, 17, 9, 8, 8, 4, 3, 1], 
                borderColor: '#ffd102',
                tension: 0
            },
            {
                label: 'จำนวนคำขอการรับเลี้ยงสัตว์ต่อปี',
                data: [0, 2, 6, 6, 7, 10, 14, 14, 14, 19, 18, 7], 
                borderColor: '#64bdc6', 
                tension: 0
            },
            {
                label: 'จำนวนคำขอรับเลี้ยงสัตว์ที่เสร็จสิ้นต่อปี', 
                data: [0, 2, 4, 4, 6, 6, 6, 9, 14, 17, 5, 10], 
                borderColor: '#2b72fb', 
                tension: 0   
            }
        ]
    };

    const lineConfig = { 
        type: 'line',
        data: lineData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    display: false,
                },
                title: {
                    display: false,
                    text: 'สถิติจำนวนสัตว์และจำนวนคำขอรับเลี้ยงสัตว์'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5,
                    },
                    max: 20
                }
            }
        }
    };

    const ctx = document.getElementById('LineChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), lineConfig);
    } else {
        console.error("Canvas element with ID 'LineChart' not found.");
    }
}

// **เรียกใช้ทั้ง 2 กราฟพร้อมกัน**
document.addEventListener('DOMContentLoaded', function() {
    createDoughnutChart();
    createLineChart();
});


//  ------ แบบที่ 2 สร้างกราฟโดนัทจากการดึง API (ทำได้แค่โดนัท ไม่มีข้อมูลเพียงพอในการทำกราฟเส้น) -------
/*
const centerTextPlugin = {
    id: 'centerText', 
    beforeDraw(chart, args, options) {
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        ctx.save();
        
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '20px sans-serif'; 
        ctx.fillStyle = '#666'; 
        ctx.fillText('Total', centerX, centerY - 15); 

        ctx.font = '20px sans-serif'; 
        ctx.fillStyle = '#333'; 
        ctx.fillText(total.toString(), centerX, centerY + 20); 

        ctx.restore();
    }
};

// ประกาศตัวแปรเก็บ Chart Instance
let myDoughnutChartInstance = null;

// Function สำหรับดึงข้อมูล Doughnut Chart จาก API
async function fetchDoughnutData() {
    try {
        const response = await fetch('YOUR_API_URL'); // เปลี่ยนเป็น URL ของคุณ
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doughnut data:', error);
        // ถ้า API ไม่ทำงาน ใช้ข้อมูล default
        return {
            labels: ['สุนัข', 'แมว'],
            data: [9, 7]
        };
    }
}

// Function สำหรับสร้าง Doughnut Chart
async function createDoughnutChart() {
    // ดึงข้อมูลจาก API
    const apiData = await fetchDoughnutData();
    
    const doughnutData = {
        labels: apiData.labels,
        datasets: [{
            label: 'จำนวนสัตว์ตามชนิด',
            data: apiData.data,
            backgroundColor: ['#010002', '#ffd102'],
            borderColor: 'white', 
            borderWidth: 2, 
            hoverOffset: 4
        }]
    };

    const doughnutConfig = {
        type: 'doughnut', 
        data: doughnutData,
        options: {
            responsive: true,
            cutout: '75%', 
            rotation: -90, // เริ่มจากซ้ายบน
            circumference: 360, // วาดเต็มวง
            plugins: {
                legend: {
                    position: 'bottom',
                    display: false
                },
                title: {
                    display: false,
                    text: 'สัดส่วนสัตว์เลี้ยงทั้งหมดตามชนิด'
                }
            }
        },
        plugins: [centerTextPlugin] 
    };

    const canvasElement = document.getElementById('DoughnutChart');
    if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        myDoughnutChartInstance = new Chart(ctx, doughnutConfig);
    } else {
        console.error("Canvas element with ID 'DoughnutChart' not found.");
    }
}

// เรียกใช้งานเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', createDoughnutChart);
*/