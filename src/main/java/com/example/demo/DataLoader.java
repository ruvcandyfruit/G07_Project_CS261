package com.example.demo;

import com.example.demo.model.Pet;
import com.example.demo.model.User;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Component
public class DataLoader implements CommandLineRunner {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataLoader(PetRepository petRepository, UserRepository userRepository) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {

   
        if (petRepository.count() == 0) {
            petRepository.saveAll(List.of(
                new Pet("D001", "Dog", "/images/dog02.jpg", "Shokun",
                        LocalDate.of(2022, 5, 10), "Male", "Shiba Inu",
                        10.00, true, true, "None", "None"),

                new Pet("C001", "Cat", "/images/cat01.jpg", "Hunnie",
                        LocalDate.of(2023, 1, 20), "Female", "Siberian",
                        5.50, true, true, "None", "None"),

                new Pet("C002", "Cat", "/images/sphinx.jpg", "Bruno",
                        LocalDate.of(2024, 3, 15), "Male", "Sphynx",
                        3.80, true, true, "None", "Fish"),

                new Pet("D002", "Dog", "/images/doggo.jpg", "Cindy",
                        LocalDate.of(2023, 11, 1), "Female", "Golden Retriever",
                        28.0, false, true, "None", "None"),

                new Pet("D003", "Dog", "/images/poodle.jpg", "Luna",
                        LocalDate.of(2024, 7, 5), "Female", "Poodle Toy",
                        4.2, false, true, "None", "Chicken")
            ));
        }

          // --- Seed Admin User ---
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin@12345"));
            admin.setRole("ADMIN");
            admin.setActive(true);
            userRepository.save(admin);
        }

          if (userRepository.findByUsername("alice").isEmpty()) {
            User user1 = new User();
            user1.setUsername("alice");
            user1.setEmail("alice@example.com");
            user1.setPassword(passwordEncoder.encode("alice1234"));
            user1.setRole("USER");
            user1.setActive(true);
            userRepository.save(user1);
        }
    }
}
