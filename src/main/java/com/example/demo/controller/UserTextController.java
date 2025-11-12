package com.example.demo.controller;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FormService;
import com.example.demo.dto.UserFormDTO;
import com.example.demo.model.Form;
import com.example.demo.repository.FormRepository;

@RestController
@RequestMapping("/api/userform")
@CrossOrigin(origins = "*")
public class UserTextController {
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";
    @Autowired
    private FormRepository formRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FormService formService;

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

        formRepository.save(user);

        return ResponseEntity.ok().body(java.util.Collections.singletonMap("message", "Form submitted successfully!"));
    } catch (IOException e) {
        return ResponseEntity.status(500).body("File upload error: " + e.getMessage());
    }
}

@GetMapping("/submit")
public ResponseEntity<?> getAllUsers() {
    try {
        // ดึง entity ทั้งหมด
        java.util.List<Form> users = formRepository.findAll();

        // map entity -> DTO
        java.util.List<UserFormDTO> userDTOs = users.stream().map(user -> {
            UserFormDTO dto = new UserFormDTO();
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
            return dto;
        }).toList();

        return ResponseEntity.ok(userDTOs);
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error fetching users: " + e.getMessage());
    }
}

    @GetMapping("/pending")
    public ResponseEntity<Form> getPending(@RequestHeader("X-USER-ID") Long userId,@PathVariable Long id, @RequestBody StatusPayload payload) {
        // ensureAdmin(userId);
        Form updated = formService.changeStatus(id, payload.getStatus(), userId);
        return ResponseEntity.ok(updated);
    }
    // Admin approve/reject
    @PutMapping("/{id}/status")
    public ResponseEntity<Form> changeStatus(@RequestHeader("X-USER-ID") Long userId, @PathVariable Long id, @RequestBody StatusPayload payload) {
        // ensureAdmin(userId);
        Form updated = formService.changeStatus(id, payload.getStatus(), userId);
        return ResponseEntity.ok(updated);
    }

    private void ensureAdmin(Long userId) {
        User u = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not found"));
        if (!"ADMIN".equalsIgnoreCase(u.getRole())) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Requires ADMIN role");
    }

    // simple payload class
    public static class StatusPayload {
        private String status;
        public String getStatus(){ return status; }
        public void setStatus(String status){ this.status = status; }
    }

}