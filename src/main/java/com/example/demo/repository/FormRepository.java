package com.example.demo.repository;

import com.example.demo.model.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormRepository extends JpaRepository<Form, Long>{
    List<Form> findByUserId(Long userId);
    List<Form> findByPetId(Long petId);
    List<Form> findByStatus(String status);
}