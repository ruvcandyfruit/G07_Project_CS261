package com.example.demo.controller;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.UserFormDTO;
import com.example.demo.dto.UserFormOutputDTO;
import com.example.demo.model.Form;
import com.example.demo.repository.FormRepository;

@RestController
@RequestMapping("/api/userform")
@CrossOrigin(origins = "*")
public class UserTextController {
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";
    @Autowired
    private FormRepository user1Repository;

   @PostMapping("/submit")
    public ResponseEntity<?> submitForm(
        @ModelAttribute UserFormDTO formDTO,
        @RequestParam("identityDoc") MultipartFile identityDoc,
        @RequestParam("residenceDoc") MultipartFile residenceDoc
        
) {
    try {
        // สร้างโฟลเดอร์ถ้ายังไม่มี
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) uploadFolder.mkdirs();

        // อัปโหลดไฟล์
        String identityPath = Paths.get(uploadDir, StringUtils.cleanPath(identityDoc.getOriginalFilename())).toString();
        identityDoc.transferTo(new File(identityPath));

        String residencePath = Paths.get(uploadDir, StringUtils.cleanPath(residenceDoc.getOriginalFilename())).toString();
        residenceDoc.transferTo(new File(residencePath));

        // map DTO ไป entity
        Form user = new Form();
        user.setFirstName(formDTO.getFirstName());
        user.setLastName(formDTO.getLastName());
        user.setDob(formDTO.getDob());
        user.setPhone(formDTO.getPhone());
        user.setEmail(formDTO.getEmail());
        user.setOccupation(formDTO.getOccupation());
        user.setAddress(formDTO.getAddress());
        user.setResidenceType(formDTO.getResidenceType());
        user.setExperience(formDTO.getExperience());
        user.setReason(formDTO.getReason());
        user.setTrueInfo(formDTO.getTrueInfo());
        user.setAcceptRight(formDTO.getAcceptRight());
        user.setHomeVisits(formDTO.getHomeVisits());
        user.setIdentityDoc(identityPath);
        user.setResidenceDoc(residencePath);
        user.setResultEstimate(null);
        user.setMeetDate(null);
        user.setPetId(formDTO.getPetId());
        user.setUserId(formDTO.getUserId());
        user.setStatus("PENDING");


        user1Repository.save(user);

        return ResponseEntity.ok().body(java.util.Collections.singletonMap("message", "Form submitted successfully!"));
    } catch (IOException e) {
        return ResponseEntity.status(500).body("File upload error: " + e.getMessage());
    }
}

@GetMapping("/submit")
public ResponseEntity<?> getAllUsers() {
    try {
        // ดึง entity ทั้งหมด
        java.util.List<Form> users = user1Repository.findAll();

        // map entity -> DTO
        java.util.List<UserFormOutputDTO> userDTOs = users.stream().map(user -> {
            UserFormOutputDTO dto = new UserFormOutputDTO();
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setDob(user.getDob());
            dto.setPhone(user.getPhone());
            dto.setEmail(user.getEmail());
            dto.setOccupation(user.getOccupation());
            dto.setAddress(user.getAddress());
            dto.setResidenceType(user.getResidenceType());
            dto.setExperience(user.getExperience());
            dto.setReason(user.getReason());
            dto.setTrueInfo(user.getTrueInfo());
            dto.setAcceptRight(user.getAcceptRight());
            dto.setHomeVisits(user.getHomeVisits());
            dto.setStatus(user.getStatus());
            dto.setPetId(user.getPetId()); 
            dto.setUserId(user.getUserId());
            dto.setResultEstimate(user.getResultEstimate());
            dto.setMeetDate(user.getMeetDate());
            
            String identityDocPath = user.getIdentityDoc();
            if (identityDocPath != null && !identityDocPath.isEmpty()) {
                // ใช้ Paths.get().getFileName().toString() เพื่อดึงแค่ชื่อไฟล์
                dto.setIdentityDoc(Paths.get(identityDocPath).getFileName().toString()); 
            } else {
                dto.setIdentityDoc("-");
            }

            String residenceDocPath = user.getResidenceDoc();
            if (residenceDocPath != null && !residenceDocPath.isEmpty()) {
                dto.setResidenceDoc(Paths.get(residenceDocPath).getFileName().toString());
            } else {
                dto.setResidenceDoc("-");
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(userDTOs);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error fetching users: " + e.getMessage());
    }
}
@GetMapping("/pet-status/{petID}")
public ResponseEntity<?> getStatusByPetID(@PathVariable String petID) {
    Form form = user1Repository.findByPetId(petID);

    if (form == null) {
        return ResponseEntity.ok(
            java.util.Collections.singletonMap("status", "NO_FORM")
        );
    }

    return ResponseEntity.ok(
        java.util.Collections.singletonMap("status", form.getStatus())
    );
}

@GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

           
            if (resource.exists() && resource.isReadable()) {
                // ส่งไฟล์กลับไป
                String contentType = "application/octet-stream"; 
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                      
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                // หากไม่พบไฟล์
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            // กรณีที่ URL ของไฟล์ไม่ถูกต้อง
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            // ข้อผิดพลาดอื่นๆ
            return ResponseEntity.internalServerError().build();
        }
    }
}