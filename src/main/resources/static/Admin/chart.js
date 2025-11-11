// ================ Doughnut chart ======================

// 1. สร้าง Plugin สำหรับแสดงข้อความตรงกลาง
const centerTextPlugin = {
    id: 'centerText', 
    beforeDraw(chart, args, options) {
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        ctx.save();
        
        // คำนวณค่าทั้งหมด
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

        // กำหนดตำแหน่งให้อยู่กึ่งกลาง
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        // วาดข้อความ "Total"
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '20px sans-serif'; 
        ctx.fillStyle = '#666'; 
        ctx.fillText('Total', centerX, centerY - 15); 

        // วาดตัวเลขรวม
        ctx.font = '40px sans-serif'; 
        ctx.fillStyle = '#333'; 
        ctx.fillText(total.toString(), centerX, centerY + 20); 

        ctx.restore();
    }
};

// 2. Function หลักสำหรับสร้างกราฟ (เปลี่ยนให้รองรับ Fetch API)
async function createDoughnutChart() { // <--- เพิ่ม async
    const canvasElement = document.getElementById('DoughnutChart');
    if (!canvasElement) {
        console.error("Canvas element with ID 'DoughnutChart' not found.");
        return;
    }

    // 1. กำหนด URL ของ API
    const apiUrl = 'https://api.example.com/adoption/stats'; // <<< แก้ URL ตรงนี้!

    try {
        // 2. Fetch ข้อมูลจาก API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json(); // แปลง response เป็น JSON

        // 3. เตรียม Data โดยใช้ข้อมูลจาก API
        const data = {
            // สมมติว่า API ส่ง { labels: ['สุนัข', 'แมว', ...], data: [300, 50, ...] }
            labels: apiData.labels, // <--- ใช้ Labels จาก API
            datasets: [{
                label: 'จำนวนการรับเลี้ยง',
                data: apiData.data, // <--- ใช้ Data จาก API
                backgroundColor: [
                    // คุณอาจต้องให้ API ส่ง Array ของสีมาด้วย หรือกำหนดสีเองตามจำนวนข้อมูล
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)', 
                    'rgb(153, 102, 255)' 
                ],
                borderColor: 'white', 
                borderWidth: 2, 
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'doughnut', 
            data: data, // <--- ใช้ Data ที่สร้างจาก API
            options: {
                responsive: true,
                cutout: '75%', 
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'สัดส่วนการรับเลี้ยงตามประเภทสัตว์ (จาก API)'
                    }
                }
            },
            plugins: [centerTextPlugin] 
        };

        // 4. สร้าง Chart
        const ctx = canvasElement.getContext('2d');
        new Chart(ctx, config);

        // เก็บ Instance ไว้ในตัวแปร global
        DoughnutChartInstance = new Chart(ctx, config);

    } catch (error) {
        console.error('Failed to fetch data or render chart:', error);
        // สามารถเพิ่มโค้ดแสดงข้อความ Error บนหน้าเว็บได้ที่นี่
    }
}

// 3. เพิ่ม Logic สำหรับบังคับ Resize เมื่อขนาดหน้าจอเปลี่ยน
function handleResize() {
    // ตรวจสอบว่า Chart Instance ถูกสร้างแล้ว
    if (DoughnutChartInstance) {
        // **เรียกใช้ .resize() เพื่อบังคับให้ Chart.js ปรับขนาดตาม Container ใหม่**
        DoughnutChartInstance.resize();
    }
}

// **เรียกใช้งานเมื่อหน้าเว็บโหลดเสร็จ**
document.addEventListener('DOMContentLoaded', createDoughnutChart);

// **เพิ่ม Event Listener เพื่อตรวจจับการเปลี่ยนขนาดหน้าต่าง**
// เมื่อผู้ใช้ลากขยายหน้าต่างเบราว์เซอร์ จะเรียก handleResize
window.addEventListener('resize', handleResize);

// **ทางเลือกเสริม:** หาก Chart ยังไม่ responsive แม้จะใช้ window.addEventListener
// คุณสามารถใช้ ResizeObserver เพื่อดูการเปลี่ยนแปลงขนาดของ Canvas Container โดยตรง

const canvasElement = document.getElementById('DoughnutChart');
if (canvasElement && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(entries => {
        handleResize(); // เรียก resize ทุกครั้งที่ขนาด container เปลี่ยน
    });
    // สั่งให้ Observer เฝ้าดูการเปลี่ยนแปลงของ container
    observer.observe(canvasElement.parentElement); 
}


// ================ Line chart ======================
const API_URL = 'https://api.example.com/daily-sales'; 

async function createLineChart() {
    let salesData = [];
    
    // ขั้นตอนที่ 1: Fetch ข้อมูลจาก API
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        salesData = await response.json();
        console.log("Data fetched:", salesData);

    } catch (error) {
        console.error("Could not fetch data:", error);
        // แสดงข้อความ error ในกรณีที่ดึงข้อมูลไม่สำเร็จ
        document.getElementById('chartContainer').innerHTML = "<p>ไม่สามารถดึงข้อมูลยอดขายได้</p>";
        return;
    }

    // ขั้นตอนที่ 2: จัดเตรียมข้อมูลสำหรับ Chart.js
    const labels = salesData.map(item => item.date); // แกน X: วันที่
    const dataPoints = salesData.map(item => item.sales); // แกน Y: ยอดขาย

    const data = {
        labels: labels,
        datasets: [{
            label: 'ยอดขายรายวัน (บาท)',
            data: dataPoints,
            borderColor: 'rgb(75, 192, 192)', // สีเส้นกราฟ
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // สีพื้นหลังใต้เส้น
            tension: 0.2, // ทำให้เส้นโค้งเล็กน้อย
            borderWidth: 2
        }]
    };

    // ขั้นตอนที่ 3: วาดกราฟด้วย Chart.js
    const config = {
        type: 'line', // กำหนดให้เป็นกราฟเส้น
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ยอดขาย'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'วันที่'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'กราฟแสดงยอดขายประจำวัน'
                }
            }
        }
    };

    const myChart = new Chart(
        document.getElementById('LineChart'),
        config
    );
}

// เรียกใช้ฟังก์ชันหลัก
createLineChart();