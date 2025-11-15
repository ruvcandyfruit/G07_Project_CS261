package com.example.demo.dto;

import lombok.Data;
@Data
public class FormCountDTO {
    private Long petId;
    private Long totalForms;

    public FormCountDTO(Long petId, Long totalForms) {
        this.petId = petId;
        this.totalForms = totalForms;
    }
}