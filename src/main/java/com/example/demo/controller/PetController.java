package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
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

  @DeleteMapping("/{id}")
public ResponseEntity<String> deletePet(@PathVariable Long id) {
    if (!petRepository.existsById(id)) {
        return ResponseEntity.status(404).body("Pet not found");
    }
    petRepository.deleteById(id);
    return ResponseEntity.ok("Deleted");
}

 @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @RequestBody Pet petDetails) {
        return petRepository.findById(id).map(pet -> {
          
            pet.setName(petDetails.getName());
            pet.setType(petDetails.getType());
            pet.setGender(petDetails.getGender());
            pet.setBreed(petDetails.getBreed());
            pet.setWeight(petDetails.getWeight());
            pet.setImage(petDetails.getImage());
            pet.setSterilisation(petDetails.isSterilisation());
            pet.setVaccine(petDetails.isVaccine());
            pet.setDisease(petDetails.getDisease());
            pet.setFoodAllergy(petDetails.getFoodAllergy());

            Pet updatedPet = petRepository.save(pet);
            return ResponseEntity.ok(updatedPet);
        }).orElse(ResponseEntity.notFound().build());
    }


}
    



