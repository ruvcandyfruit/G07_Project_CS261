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
                new Pet("1", "Dog", "/images/cat01.jpg", "Luna", 3, "Female", "Bulldog", 20.00, true, false, "None", "Nuh"),
                new Pet("2", "Cat", "https://your-image-folder/luna.jpg", "Nunie", 50, "Male", "Pallas", 1.00, true, true, "None", "Yuh")
            ));
        }
    }
}