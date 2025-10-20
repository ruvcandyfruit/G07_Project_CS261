package com.example.demo;
import com.example.demo.model.Pet;
import com.example.demo.repository.PetRepository;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final PetRepository petRepository;

    public DataLoader(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // --- Seed Sample Pets ---
        if (petRepository.count() == 0) {
            petRepository.saveAll(List.of(
                new Pet("D001", "Dog", "/images/dog02.jpg", "Shokun", 2, "Male", "Shiba Inu", 10.00, true, true, "None", "None"),
                new Pet("C001", "Cat", "/images/cat01.jpg", "Hunnie", 2, "Female", "Siberian", 5.50, true, true, "None", "None"),
                new Pet("C002", "Cat", "/images/sphinx.jpg", "Bruno", 1, "Male", "Sphynx", 3.80, true, true, "None", "Fish"),
                new Pet("D002", "Dog", "/images/doggo.jpg", "Cindy", 1, "Female", "Golden Retriever", 28, false, true, "None", "None"),
                new Pet("D003", "Dog", "/images/poodle.jpg", "Luna", 1, "Female", "Poodle Toy", 4.2, false, true, "None", "Chicken")
            ));
        }
    }
}