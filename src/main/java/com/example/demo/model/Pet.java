package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String petID;       
    private String type;          
    private String image;
    private String name;
    private int age;
    private String gender;
    private String breed;
    private double weight;
    private boolean sterilisation;
    private boolean vaccine;
    private String disease;
    @Column(name = "food_allergy")
    private String foodAllergy;

    // --- Constructor ---
    public Pet() {
       
    }

    public Pet(String petID, String type, String image, String name, int age, String gender, String breed, double weight, boolean sterilisation, boolean vaccine, String disease, String foodAllergy) {
        this.petID = petID;
        this.type = type;
        this.name = name;
        this.image = image;
        this.age = age;
        this.gender = gender;
        this.breed = breed;
        this.weight = weight;
        this.sterilisation = sterilisation;
        this.vaccine = vaccine;
        this.disease = disease;
        this.foodAllergy = foodAllergy;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPetID() { return petID; }
    public void setPetID(String petID) { this.petID= petID; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public boolean isSterilisation() { return sterilisation; }
    public void setSterilisation(boolean sterilisation) { this.sterilisation = sterilisation; }

    public boolean isVaccine() { return vaccine; }
    public void setVaccine(boolean vaccine) { this.vaccine = vaccine; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getFoodAllergy() { return foodAllergy; }
    public void setFoodAllergy(String foodAllergy) { this.foodAllergy = foodAllergy; }
}
