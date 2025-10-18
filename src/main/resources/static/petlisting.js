document.addEventListener('DOMContentLoaded', () => {

    // --- ฝากBE เปลี่ยนตรงนี้นะ 1. MOCK BACKEND DATA (ข้อมูลจำลองจากหลังบ้าน) --
    const mockPetData = [
        { id: 1, name: "เมกาทรอน", image: "homepageResources/hq720.jpg", type: "dog", gender: "male", health: ["vaccinated"], breed: "Labubu", age: "young" },
        { id: 2, name: "น้องส้ม", image: "https://i.pinimg.com/736x/0e/a3/6e/0ea36ee7bc893407525f1d30b72702cb.jpg", type: "cat", gender: "female", health: ["neutered", "vaccinated"], breed: "Persian", age: "baby" },
        { id: 3, name: "บราวนี่", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", type: "dog", gender: "male", health: ["neutered"], breed: "Golden Retriever", age: "adult" },
        { id: 4, name: "ลูน่า", image: "https://static.boredpanda.com/blog/wp-content/uploads/2016/02/big-sao-paulo-maine-coon-cat-lotus-2.jpg", type: "cat", gender: "female", health: ["vaccinated"], breed: "Maine Coon", age: "young" },
        { id: 5, name: "ร็อคกี้", image: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg", type: "dog", gender: "male", health: [], breed: "Beagle", age: "baby" },
        { id: 6, name: "เจ้าสามสี", image: "https://static.onecms.io/wp-content/uploads/sites/47/2020/11/02/calico-cat-lying-on-side-1296548232-2000.jpg", type: "cat", gender: "female", health: ["neutered", "vaccinated"], breed: "Calico", age: "senior" }
    ];

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
                <img src="${pet.image}" alt="${pet.name}">
                <p class="name">${pet.name}</p>
            `;
            // ✨ เพิ่ม Event Listener ให้คลิกแล้วไปหน้า Detail พร้อมส่ง ID ✨
            petCard.addEventListener('click', () => {
                window.location.href = `petdetail.html?id=${pet.id}`;
            });
            petListContainer.appendChild(petCard);
        });
    };

    // --- 4. ฟังก์ชันสำหรับ "กรอง" ข้อมูล ---
    const filterPets = () => {
        // รวบรวมค่า filter ที่เลือก (โค้ดส่วนนี้มาจากของคนสวยเลยครับ)
        const filters = collectFilterValues();

        // เริ่มกรองจากข้อมูลทั้งหมด
        let filteredPets = mockPetData.filter(pet => {
            let isMatch = true;
            if (filters.type && pet.type !== filters.type) isMatch = false;
            if (filters.gender && pet.gender !== filters.gender) isMatch = false;
            if (filters.age && pet.age !== filters.age) isMatch = false;
            if (filters.health && !filters.health.every(h => pet.health.includes(h))) isMatch = false;
            if (filters.breed && !filters.breed.includes(pet.breed)) isMatch = false;
            return isMatch;
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