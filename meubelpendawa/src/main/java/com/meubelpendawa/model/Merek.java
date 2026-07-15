package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "merek")
@Getter 
@Setter 
@NoArgsConstructor
public class Merek {
    
    @Id
    private String idMerek;

    private String namaMerek;


    public Merek(String namaMerek) {
        this.namaMerek = namaMerek;
    }

   
}
