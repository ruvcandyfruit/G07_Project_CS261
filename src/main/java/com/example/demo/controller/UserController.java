package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths; // ใช้ * เพื่อรวม import ที่จำเป็น
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.User1Dto;
import com.example.demo.model.User1;
import com.example.demo.repository.UserRepository;

import lombok.Data;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    // --- (จำเป็นต้องมีเพื่อให้โค้ดนี้รันได้) ---
    // *ต้องสร้าง UserRegistrationDto.java ก่อน*
    @Data
    public static class UserRegistrationDto {
        private String firstName;
        private String lastName;
        private String age;
        private String phone;
        private String address;
        private String career;

    }
    // ------------------------------------------
    
    @Autowired
    private UserRepository userRepository;
    
    private static final String UPLOAD_DIR = "uploads/";

 

    // GET /api/users - ดึงข้อมูลผู้ใช้ทั้งหมด (เมธอดเดิม)
    @GetMapping
    public List<User1> getAllUsers() {
        return userRepository.findAll();
    }
    
    // **เมธอดที่ถูกแก้ไขให้รับ DTO และ File**
    @PostMapping 
    public User1Dto createUser(
        @ModelAttribute UserRegistrationDto userDto, // ใช้ @ModelAttribute สำหรับ Text fields จาก form-data
        @RequestParam("profileImageUrl") MultipartFile file) throws IOException { // ใช้ @RequestParam สำหรับไฟล์
        
        String imageUrl = null;
        
        // 1. จัดการไฟล์ (บันทึกไฟล์และรับ URL)
        if (!file.isEmpty()) {
            imageUrl = saveImageToFileSystem(file);
        }

        // 2. แปลง DTO เป็น Model
        User1 userModel = convertToModel(userDto);
        // 3. ตั้งค่า URL ภาพใน Model
        userModel.setProfileImageUrl(imageUrl); 
        
        // 4. บันทึก Model ลงฐานข้อมูล
        User1 savedUser = userRepository.save(userModel); 
        
        // 5. แปลง Model ที่มี ID แล้ว กลับไปเป็น DTO
        return convertToDto(savedUser); 
    }
    
    // --- เมธอดช่วยในการบันทึกไฟล์ ---
    private String saveImageToFileSystem(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
             extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        
        return "/uploads/" + uniqueFilename;
 
    }
    
    
    // --- เมธอดช่วยในการแปลงข้อมูล ---
    
    private User1 convertToModel(UserRegistrationDto dto) { // เปลี่ยน DTO ที่รับเข้า
        User1 model = new User1();
        model.setFirstName(dto.getFirstName());
        model.setLastName(dto.getLastName());
        model.setAge(dto.getAge());
        model.setPhone(dto.getPhone());
        model.setAddress(dto.getAddress());
        model.setCareer(dto.getCareer());
        // ต้องให้ Model มี setProfileImageUrl ด้วย
        return model;
    }
    
    private User1Dto convertToDto(User1 model) {
        User1Dto dto = new User1Dto();
        dto.setId(model.getId());
        dto.setFirstName(model.getFirstName());
        dto.setLastName(model.getLastName());
        dto.setAge(model.getAge());
        dto.setPhone(model.getPhone());
        dto.setAddress(model.getAddress());
        dto.setCareer(model.getCareer());
        // ต้องให้ DTO มี getProfileImageUrl ด้วย
        dto.setProfileImageUrl(model.getProfileImageUrl()); 
       
        return dto;
    }
}