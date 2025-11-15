package com.example.demo.service;

import com.example.demo.model.Form;
import com.example.demo.model.Pet;
import com.example.demo.repository.FormRepository;
import com.example.demo.repository.PetRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Service
public class FormService {
    
    @Autowired
    private FormRepository formRepository;

    @Autowired
    private PetRepository petRepository;

    public Form changeStatus(Long requestId, String newStatus, Long adminId) {
        Form req = formRepository.findById(requestId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if(req.getStatus().equals(newStatus)) return req;
        req.setStatus(newStatus);
        req.setApprovedBy(adminId);
        req.setApprovedAt(LocalDateTime.now());
        req.setMeetDate(req.getApprovedAt().plusWeeks(2));
        formRepository.save(req);

        // if approved, mark pet as ADOPTED
        if ("APPROVED".equalsIgnoreCase(newStatus)) {
            Pet pet = req.getPet(); // get the Pet object directly
            if (pet == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found");
            }
            pet.setStatus("ADOPTED");
            petRepository.save(pet);
        }

        return req;
    }
}
