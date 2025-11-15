package com.example.demo.repository;

import com.example.demo.model.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FormRepository extends JpaRepository<Form, Long>{
    @Query("SELECT f.pet.id AS petId, COUNT(f) AS totalRequests " +
           "FROM Form f GROUP BY f.pet.id")
    List<Object[]> countRequestsByPet();
    List<Form> findByUserId(Long userId);
    List<Form> findByPetId(Long petId);
    List<Form> findByStatus(String status);
    
}
