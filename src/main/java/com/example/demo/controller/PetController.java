package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Pet;
import com.example.demo.repository.PetRepository;

import java.util.List;


@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetRepository petRepository;

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @GetMapping("/{id}")
    public Pet getPetById(@PathVariable Long id) {
        return petRepository.findById(id).orElse(null);
    }
    
    @PostMapping
    public Pet addPet(@RequestBody Pet pet) {
        return petRepository.save(pet);
    }
    


}
