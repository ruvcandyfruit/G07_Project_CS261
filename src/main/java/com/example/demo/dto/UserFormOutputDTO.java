package com.example.demo.dto;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class UserFormOutputDTO {
     private String firstName;
    private String lastName;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dob;
    private String phone;
    private String email;
    private String occupation;
    private String address;
    private String residenceType;
    private String experience;
    private String reason;
    private Boolean trueInfo;
    private Boolean acceptRight;
    private Boolean homeVisits;
    private String status;
    private String identityDoc; // ใช้สำหรับแสดงชื่อไฟล์ในตาราง
    private String residenceDoc; // ใช้สำหรับแสดงชื่อไฟล์ในตาราง
    private String userId;
    private String petID;
}