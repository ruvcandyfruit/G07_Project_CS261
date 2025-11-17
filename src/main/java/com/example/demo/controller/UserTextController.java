package com.example.demo.controller;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FormService;
import com.example.demo.dto.FormCountDTO;
import com.example.demo.dto.UserFormDTO;
import com.example.demo.dto.UserFormOutputDTO;
import com.example.demo.model.Form;
import com.example.demo.model.Pet;
import com.example.demo.repository.FormRepository;
import com.example.demo.repository.PetRepository;

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

    @Autowired
    private PetRepository petRepository;

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
        user.setReceiveType(formDTO.getReceiveType());

        User userEntity = userRepository.findById(formDTO.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUser(userEntity);

        Pet petEntity = petRepository.findById(formDTO.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        user.setPet(petEntity);
        user.setStatus("PENDING");
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
            dto.setPetId(user.getPet().getPetID()); 
            dto.setUserId(user.getUser().getId());
            dto.setApprovedAt(user.getApprovedAt());
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
public ResponseEntity<?> getStatusByPetID(@PathVariable Long petID) {
    List<Form> form = formRepository.findByPetId(petID);

    if (form.isEmpty()) {
        return ResponseEntity.ok(
            java.util.Collections.singletonMap("status", "NO_FORM")
        );
    }

    Form forms = form.get(0); // take the first Form
    return ResponseEntity.ok(
        java.util.Collections.singletonMap("status", forms.getStatus())
    );
}

@GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            
            
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

           
           
            if (resource.exists() && resource.isReadable()) {
                // ส่งไฟล์กลับไป
                String contentType = "application/octet-stream"; // ประเภทไฟล์ทั่วไป (binary stream)
                
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

 // ใน Controller ที่เกี่ยวข้อง
// ...
@GetMapping("/statuses")
@CrossOrigin(origins = "*") 
public ResponseEntity<List<Map<String, Object>>> getStatusesAndIds() {
    
    List<Form> forms; 

    try {
        forms = formRepository.findAll(); 

        // 🔴 แก้ไข: ใช้ (Map<String, Object>) เพื่อระบุ Type ให้ชัดเจน
        List<Map<String, Object>> statusList = forms.stream()
            .map(form -> {
                Map<String, Object> map = new HashMap<>();
                map.put("petId", form.getPet().getId());
                map.put("status", form.getStatus());
                return map;
})
.toList();


        return ResponseEntity.ok(statusList);
        
    } catch (Exception e) {
        System.err.println("Database error fetching statuses: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(null); 
    }
}


    @GetMapping("/pending")
    public ResponseEntity<Form> getPending(@RequestHeader("X-USER-ID") Long userId,@PathVariable Long id, @RequestBody StatusPayload payload) {
        ensureAdmin(userId);
        Form updated = formService.changeStatus(id, payload.getStatus(), userId);
        return ResponseEntity.ok(updated);
    }
    // Admin approve/reject
    @PutMapping("/{id}/status")
    public ResponseEntity<Form> changeStatus(@RequestHeader("X-USER-ID") Long userId, @PathVariable Long id, @RequestBody StatusPayload payload) {
        ensureAdmin(userId);
        Form updated = formService.changeStatus(id, payload.getStatus(), userId);
        return ResponseEntity.ok(updated);
    }

    private void ensureAdmin(Long userId) {
        User u = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not found"));
        if (!"ADMIN".equalsIgnoreCase(u.getRole())) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Requires ADMIN role");
    }

    @GetMapping("/admin/pet-requests")
    public List<FormCountDTO> getFormCounts() {
        List<Object[]> results = formRepository.countRequestsByPet();
        return results.stream()
            .map(row -> new FormCountDTO(
            (Long) row[0],
            (Long) row[1]
            ))
            .toList();
    }

   @GetMapping("/admin/pet/{petId}/requests")
    public List<Form> getRequestsForPet(@PathVariable("petId") Long petId) {    
    return formRepository.findByPetId(petId);
}

    
    // simple payload class
    public static class StatusPayload {
        private String status;
        public String getStatus(){ return status; }
        public void setStatus(String status){ this.status = status; }
    }

}