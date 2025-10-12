package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import jakarta.persistence.Column;

@Entity
@Table(name = "pets")  
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pet_id", length = 10)
    private String petId;

    @Column(length = 50)
    private String name;

    @Column(length = 10)
    private String type;

    @Column(length = 10)
    private String gender;

    private LocalDate age; // เก็บวันที่เกิด

    @Column(length = 50)
    private String breed;

    private Float weight;

    private Boolean sterilisation;

    @Column(length = 50)
    private String vaccine;

    @Column(length = 50)
    private String disease;

    @Column(name = "food_allergy", length = 50)
    private String foodAllergy;

    @Column(name = "photo_path", length = 50)
    private String photoPath;

    // Constructors
    public Pet() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getPetId() { return petId; }
    public void setPetId(String petId) { this.petId = petId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getAge() { return age; }
    public void setAge(LocalDate age) { this.age = age; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }

    public Boolean getSterilisation() { return sterilisation; }
    public void setSterilisation(Boolean sterilisation) { this.sterilisation = sterilisation; }

    public String getVaccine() { return vaccine; }
    public void setVaccine(String vaccine) { this.vaccine = vaccine; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getFoodAllergy() { return foodAllergy; }
    public void setFoodAllergy(String foodAllergy) { this.foodAllergy = foodAllergy; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
}

