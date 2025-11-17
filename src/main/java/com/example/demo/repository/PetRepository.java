package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Pet;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> { 
    List<Pet> findByStatus(String status);
}
