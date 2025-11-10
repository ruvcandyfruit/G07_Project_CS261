document.addEventListener('DOMContentLoaded', async () => {

    let mockPetData = []; 

    try {
        const response = await fetch("http://localhost:8081/api/pets"); //  ดึงข้อมูลจาก backend 
        if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้");
        }
        mockPetData = await response.json();
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลสัตว์เลี้ยง:", error);
        alert("ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้");
    }

    // --- 2. เลือก ELEMENT ที่จำเป็น ---
    const petListContainer = document.getElementById('pet-list');
    const filterContainer = document.querySelector('.filter');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');

    // --- 3. ฟังก์ชันสำหรับ "แสดงผล" การ์ดสัตว์เลี้ยง ---
    const displayPets = (petsToDisplay) => {
        petListContainer.innerHTML = ""; // ล้างข้อมูลเก่าทิ้ง

        if (petsToDisplay.length === 0) {
            petListContainer.innerHTML = "<p>ไม่พบสัตว์เลี้ยงตามเงื่อนไขที่เลือก</p>";
            return;
        }

        petsToDisplay.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.innerHTML = `
               <img src="http://localhost:8081${pet.image || '/images/placeholder.jpg'}" alt="${pet.name}" />
                <p class="name">${pet.name}</p>
            `;
            // ✨ คลิกแล้วไปหน้า detail พร้อมส่ง id ✨
            petCard.addEventListener('click', () => {
                window.location.href = `petdetail.html?id=${pet.id}`;
            });
            petListContainer.appendChild(petCard);
        });
    };

   
    const filterPets = () => {
        // รวบรวมค่า filter ที่เลือก (โค้ดส่วนนี้มาจากของคนสวยเลยครับ)
        const filters = collectFilterValues();

        const mapAgeGroup = (age) => {
        if (age <= 1) return "baby";
        if (age <= 5) return "young";
        if (age <= 10) return "adult";
        return "senior";
        };

        // เริ่มกรองจากข้อมูลทั้งหมด
        let filteredPets = mockPetData.filter(pet => {
            if (filters.type && pet.type.toLowerCase() !== filters.type.toLowerCase()) return false;
            if (filters.gender && pet.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;
            if (filters.age && mapAgeGroup(pet.age) !== filters.age) return false;
            if (filters.health) {
                if (filters.health.includes("neutered") && !pet.sterilisation) return false;
                if (filters.health.includes("vaccinated") && !pet.vaccine) return false;
            }
            // if (filters.breed && !filters.breed.some(b => {
            //     const breedName = pet.breed?.toLowerCase().replace(/\s+/g, '');
            //     const selected = b.toLowerCase().replace(/\s+/g, '');
            //     return breedName.includes(selected);
            // })) return false;
            if (filters.breed && !filters.breed.some(b => pet.breed.toLowerCase().includes(b.toLowerCase()))) return false;
            return true;
        });

        // แสดงผลลัพธ์ที่กรองแล้ว
        displayPets(filteredPets);
    };

    // --- 5. เพิ่ม EVENT LISTENERS ---
    // เมื่อกดปุ่ม "Search" ให้ทำการกรองข้อมูล
    applyFiltersBtn.addEventListener('click', filterPets);

    // ทำให้ปุ่ม filter มีสีเมื่อถูกเลือก (เพื่อ UX ที่ดี)
    filterContainer.addEventListener('change', (event) => {
        if (event.target.type === 'radio' || event.target.type === 'checkbox') {
            const labels = filterContainer.querySelectorAll('label.pick');
            labels.forEach(label => {
                const input = document.getElementById(label.getAttribute('for'));
                if (input && input.checked) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    });

    // --- 6. แสดงสัตว์เลี้ยงทั้งหมดในครั้งแรกที่โหลดหน้า ---
    displayPets(mockPetData);

    // (ฟังก์ชัน collectFilterValues มาจากโค้ดของคนสวย ซึ่งทำงานได้ดีมากครับ)
    const collectFilterValues = () => {
        // ... โค้ด collectFilterValues ของคนสวย ...
        const filters = {};
        const animalType = filterContainer.querySelector('input[name="animal-type"]:checked');
        if (animalType) filters.type = animalType.value;
        const gender = filterContainer.querySelector('input[name="gender"]:checked');
        if (gender) filters.gender = gender.value;
        const healthOptions = filterContainer.querySelectorAll('input[name="health"]:checked');
        if (healthOptions.length > 0) filters.health = Array.from(healthOptions).map(cb => cb.value);
        const breedOptions = filterContainer.querySelectorAll('input[name="breed"]:checked');
        if (breedOptions.length > 0) filters.breed = Array.from(breedOptions).map(cb => cb.value);
        const age = filterContainer.querySelector('#age-filter').value;
        if (age) filters.age = age;
        return filters;
    };
});