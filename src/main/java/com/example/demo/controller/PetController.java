package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Pet;
import com.example.demo.repository.PetRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetRepository petRepository;


    private final String upload = "static/images/"; 

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;

    }

 
    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

 
    @GetMapping("/{id}")
    public Pet getPetById(@PathVariable Long id) {
        return petRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found with ID: " + id));
    }

  
    @PostMapping(consumes = {"multipart/form-data"}) 
    public ResponseEntity<Pet> createPet(
            @RequestPart("pet") Pet pet, 
            @RequestParam(value = "file", required = false) MultipartFile file)
      { 

        if (file != null && !file.isEmpty()) {
            try {
                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
                String fileExtension = originalFilename.contains(".") ? 
                                       originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                Path filepath = Paths.get(upload, uniqueFilename);
                File dir = filepath.toFile().getParentFile();
                if (!dir.exists()) {
                    dir.mkdirs(); 
                }  
                Files.write(filepath, file.getBytes());
                String fileUrl = "/images/" + uniqueFilename; 
                pet.setImage(fileUrl);

            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); 
            }
        }

        Pet savedPet = petRepository.save(pet);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);
    }


@PutMapping("/{id}")
public ResponseEntity<Pet> updatePet(
        @PathVariable Long id, 
        @RequestPart("pet") Pet petDetails,
        @RequestParam(value = "file", required = false) MultipartFile file) { 

    return petRepository.findById(id).map(pet -> {
        
        pet.setName(petDetails.getName());
        pet.setType(petDetails.getType());
        pet.setGender(petDetails.getGender());
        pet.setBreed(petDetails.getBreed());
        pet.setWeight(petDetails.getWeight());
        pet.setSterilisation(petDetails.isSterilisation());
        pet.setVaccine(petDetails.isVaccine());
        pet.setDisease(petDetails.getDisease());
        pet.setFoodAllergy(petDetails.getFoodAllergy());

     
        if (file != null && !file.isEmpty()) {
            try {
                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
                String fileExtension = originalFilename.contains(".") ? 
                                       originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                
                Path filepath = Paths.get(upload, uniqueFilename);
                Files.write(filepath, file.getBytes());

                String fileUrl = "/images/" + uniqueFilename; 
                pet.setImage(fileUrl);

            } catch (IOException e) {
                e.printStackTrace();
             
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file", e);
            }
        }
        else if (petDetails.getImage() != null) {
             pet.setImage(petDetails.getImage());
        }

        Pet updatedPet = petRepository.save(pet);
        return ResponseEntity.ok(updatedPet);
    }).orElseGet(() -> 
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
    );
}

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePet(@PathVariable Long id) {
        if (!petRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pet not found");
        }
        petRepository.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

    
}