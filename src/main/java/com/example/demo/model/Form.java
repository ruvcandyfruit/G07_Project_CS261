package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "userforms")
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Part 1: Applicant Information
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "occupation", nullable = false)
    private String occupation;

    @Column(name = "identity_doc")
    private String identityDoc; // เก็บ path หรือ filename ของไฟล์

    // Part 2: Housing & Environment
    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "residence_type", nullable = false)
    private String residenceType; // house, townhouse, condo, apartment

    @Column(name = "residence_doc")
    private String residenceDoc; // เก็บ path หรือ filename ของไฟล์

    // Part 3: Lifestyle & Pet Experience
    @Column(name = "experience", nullable = false)
    private String experience;

    @Column(name = "reason", nullable = false)
    private String reason;

    // Part 4: Agreement Checkboxes
    @Column(name = "true_info", nullable = false)
    private Boolean trueInfo;

    @Column(name = "accept_right", nullable = false)
    private Boolean acceptRight;    

    @Column(name = "home_visits", nullable = false)
    private Boolean homeVisits;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

}