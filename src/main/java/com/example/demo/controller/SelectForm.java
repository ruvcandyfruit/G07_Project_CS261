package com.example.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

public class SelectForm {
    @PostMapping("/saveResidence")
public String saveResidence(@RequestParam("residenceType") String residenceType) {
    System.out.println("Selected type: " + residenceType);
    return "success";
}
}
