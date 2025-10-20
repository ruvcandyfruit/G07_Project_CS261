document.addEventListener('DOMContentLoaded', () => {
    // เลือก element ที่เกี่ยวข้องทั้งหมด
    const filterContainer = document.querySelector('.filter');
    const allFilterInputs = filterContainer.querySelectorAll('input[type="radio"], input[type="checkbox"], select');
    const filterOutputElement = document.getElementById('filter-output');

    // ฟังก์ชันสำหรับอัปเดตสถานะ Active ของปุ่ม
    const updateVisuals = () => {
        const labels = filterContainer.querySelectorAll('label.pick');
        labels.forEach(label => {
            const inputId = label.getAttribute('for');
            const input = document.getElementById(inputId);
            if (input && input.checked) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    };

    // ฟังก์ชันสำหรับรวบรวมค่า filter ที่เลือกทั้งหมด
    const collectFilterValues = () => {
        const filters = {};

        // 1. Animal Type (Radio)
        const animalType = filterContainer.querySelector('input[name="animal-type"]:checked');
        if (animalType) {
            filters.type = animalType.value;
        }

        // 2. Gender (Radio)
        const gender = filterContainer.querySelector('input[name="gender"]:checked');
        if (gender) {
            filters.gender = gender.value;
        }

        // 3. Health (Checkbox)
        const healthOptions = filterContainer.querySelectorAll('input[name="health"]:checked');
        if (healthOptions.length > 0) {
            filters.health = Array.from(healthOptions).map(cb => cb.value);
        }
        
        // 4. Breed (Checkbox)
        const breedOptions = filterContainer.querySelectorAll('input[name="breed"]:checked');
        if (breedOptions.length > 0) {
            filters.breed = Array.from(breedOptions).map(cb => cb.value);
        }

        // 5. Age (Select)
        const age = filterContainer.querySelector('#age-filter').value;
        if (age) {
            filters.age = age;
        }
        
        return filters;
    };

    // ฟังก์ชันหลักที่ทำงานเมื่อมีการเปลี่ยนแปลง
    const handleFilterChange = () => {
        // อัปเดตหน้าตาปุ่ม
        updateVisuals();
        
        // รวบรวมข้อมูล
        const currentFilters = collectFilterValues();
        
        // แสดงผลลัพธ์ (ในตัวอย่างนี้คือแสดงเป็น JSON)
        // ในการใช้งานจริง ตรงนี้จะเป็นส่วนที่เรียกฟังก์ชันเพื่อกรองข้อมูลสัตว์เลี้ยง
        filterOutputElement.textContent = JSON.stringify(currentFilters, null, 2);

        console.log("Filters updated:", currentFilters);
    };

    // เพิ่ม Event Listener ให้กับทุก input ใน filter
    allFilterInputs.forEach(input => {
        input.addEventListener('change', handleFilterChange);
    });

    // เรียกใช้ครั้งแรกเพื่อกำหนดสถานะเริ่มต้น (ถ้ามี)
    handleFilterChange();
});

document.getElementById('apply-filters-btn').addEventListener('click', () => {
    // ดึงค่า filter ล่าสุด
    const currentFilters = collectFilterValues(); 
    
    // แจ้งเตือนเพื่อจำลองการค้นหา
    alert('กำลังค้นหาด้วยเงื่อนไข: \n' + JSON.stringify(currentFilters, null, 2));

    // ในการใช้งานจริง:
    // 1. ส่ง currentFilters ไปยัง server เพื่อดึงข้อมูลใหม่
    // 2. หรือใช้ currentFilters เพื่อกรองข้อมูลที่แสดงผลบนหน้าเว็บ
    console.log("Searching with:", currentFilters);
});

const API_URL = "/api/pets";

async function loadPets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("ดึงข้อมูลสัตว์เลี้ยงไม่สำเร็จ");

        const pets = await response.json();
        const petList = document.getElementById("pet-list");
        petList.innerHTML = "";

        if (pets.length === 0) {
            petList.innerHTML = "<p>ไม่มีสัตว์เลี้ยงในระบบ</p>";
            return;
        }

        pets.forEach((pet) => {
            const petCard = document.createElement("div");
            petCard.classList.add("pet-card");
            petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}" onerror="this.src='default.jpg'">
            <h3>${pet.name}</h3>
            `;
            petCard.addEventListener("click", () => {
                window.location.href = `pet-detail.html?id=${pet.id}`;
            });
            petList.appendChild(petCard);
        });
    } catch (error) {
        console.error("error:", error);
        document.getElementById("pet-list").innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

loadPets();