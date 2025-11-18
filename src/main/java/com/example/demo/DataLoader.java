package com.example.demo;

import com.example.demo.model.Pet;
import com.example.demo.model.User;
import com.example.demo.model.Form;
import com.example.demo.repository.PetRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.FormRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Component
public class DataLoader implements CommandLineRunner {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final FormRepository formRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataLoader(PetRepository petRepository, UserRepository userRepository, FormRepository formRepository) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.formRepository = formRepository;
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

        if (formRepository.count() == 0) {
            Optional<User> aliceOpt = userRepository.findByUsername("alice");
            List<Pet> pets = petRepository.findAll();

            if (aliceOpt.isPresent() && !pets.isEmpty()) {
                User alice = aliceOpt.get();

                // Example Form 1
                Form form1 = new Form();
                form1.setFirstName("Emily");
                form1.setLastName("Johnson");
                form1.setDob(LocalDate.of(1990, 4, 12));
                form1.setPhone("+1-555-123-4567");
                form1.setEmail("emily.johnson@example.com");
                form1.setOccupation("Graphic Designer");
                form1.setIdentityDoc("id_emilyjohnson.png");
                form1.setAddress("123 Maple St, Springfield");
                form1.setResidenceType("House");
                form1.setResidenceDoc("resdoc_emily.jpg");
                form1.setExperience("Owned dogs and cats growing up.");
                form1.setReason("Want to provide a loving home.");
                form1.setTrueInfo(true);
                form1.setAcceptRight(true);
                form1.setHomeVisits(false);
                form1.setReceiveType("Home Delivery");
                form1.setStatus("PENDING");
                form1.setUser(alice);
                form1.setPet(pets.get(0)); // assign first pet

                // Example Form 2
                Form form2 = new Form();
                form2.setFirstName("Michael");
                form2.setLastName("Lee");
                form2.setDob(LocalDate.of(1985, 11, 30));
                form2.setPhone("+1-555-234-5678");
                form2.setEmail("michael.lee@example.com");
                form2.setOccupation("Software Engineer");
                form2.setIdentityDoc("id_michaellee.png");
                form2.setAddress("456 Oak Ave, Riverside");
                form2.setResidenceType("Apartment");
                form2.setResidenceDoc("resdoc_michael.jpg");
                form2.setExperience("Volunteered at local animal shelter.");
                form2.setReason("Looking for companionship.");
                form2.setTrueInfo(true);
                form2.setAcceptRight(true);
                form2.setHomeVisits(true);
                form2.setReceiveType("Self Pickup");
                form2.setStatus("APPROVED");
                form2.setApprovedBy(1L); // assume admin ID 1
                form2.setApprovedAt(LocalDateTime.of(2024, 10, 10, 15, 30));
                form2.setMeetDate(LocalDateTime.of(2024, 10, 15, 11, 0));
                form2.setUser(alice);
                form2.setPet(pets.get(1)); // assign second pet

                // Example Form 3
                Form form3 = new Form();
                form3.setFirstName("Sarah");
                form3.setLastName("Kim");
                form3.setDob(LocalDate.of(1993, 7, 15));
                form3.setPhone("+1-555-345-6789");
                form3.setEmail("sarah.kim@example.com");
                form3.setOccupation("Teacher");
                form3.setIdentityDoc("id_sarahkim.png");
                form3.setAddress("789 Pine Rd, Centerville");
                form3.setResidenceType("Condo");
                form3.setResidenceDoc("resdoc_sarah.jpg");
                form3.setExperience("Raised rabbits and small pets.");
                form3.setReason("Passionate about animal welfare.");
                form3.setTrueInfo(true);
                form3.setAcceptRight(true);
                form3.setHomeVisits(false);
                form3.setReceiveType("Home Delivery");
                form3.setStatus("REJECTED");
                form3.setApprovedBy(1L); // admin ID
                form3.setApprovedAt(LocalDateTime.of(2024, 10, 12, 9, 45));
                form3.setUser(alice);
                form3.setPet(pets.get(2)); // assign third pet

                // Save all forms
                formRepository.saveAll(List.of(form1, form2, form3));
            }
        }
    }
}
