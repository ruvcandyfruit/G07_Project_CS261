
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Form;
import com.example.demo.repository.FormRepository;

@Service
public class formService {

    // ** Repository สำหรับ DB 2 (Form) **
    @Autowired
    private FormRepository formRepository; 

    // ** Service/Repository สำหรับ DB 1 (User/Pet Data) **
    @Autowired
    private PetDataDb1Repository petDataDb1Repository; // สมมติว่านี่คือ Repos ที่เชื่อม DB 1

    public void saveFormToTwoDatabases(Form newForm) {
        
        // 1. บันทึกข้อมูลฟอร์มหลักลง DB 2
        Form savedForm = formRepository.save(newForm); 

        // 2. ดึงข้อมูลที่เกี่ยวข้องจาก DB 1 (ใช้ userId และ petId ที่ได้จาก Hidden Field)
        PetData petDataFromDb1 = petDataDb1Repository.findByUserIdAndPetId(newForm.getUserId(), newForm.getPetId());
        
        // 3. (Optional) สร้าง Entity ใหม่เพื่อบันทึกข้อมูลที่คัดลอกลงใน DB 2
        //    เช่น ถ้ามีตาราง audit_data ใน DB 2
        AuditData auditData = new AuditData();
        auditData.setFormId(savedForm.getId()); 
        auditData.setPetName(petDataFromDb1.getName());
        // ... set fields อื่นๆ ...
        
        // auditDataRepository.save(auditData); 
    }
}