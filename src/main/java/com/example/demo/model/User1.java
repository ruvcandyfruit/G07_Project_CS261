package com.example.demo.model;
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
public class User1 {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id ;
@Column(name = "first_name", nullable = false)
private String firstName ;
@Column(name = "last_name", nullable = false)
private String lastName ;
@Column(name = "age", nullable = false)
private String age ;
@Column(name = "phone", nullable = false, unique=true)
private String phone ;
@Column(name = "address", nullable = false)
private String address ;
@Column(name = "career", nullable = false)
private String career ;
@Column(name = "profile_image_url")
private String profileImageUrl;




}
