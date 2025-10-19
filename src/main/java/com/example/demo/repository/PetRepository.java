package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Pet;

public interface PetRepository extends JpaRepository<Pet, Long> { }
