package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "merek")
public class Merek {
    
    @Id
    private String idMerek;

    private String namaMerek;

    public Merek() {
    }

    public Merek(String namaMerek) {
        this.namaMerek = namaMerek;
    }

    public String getIdMerek() {
        return idMerek;
    }

    public void setIdMerek(String idMerek) {
        this.idMerek = idMerek;
    }

    public String getNamaMerek() {
        return namaMerek;
    }

    public void setNamaMerek(String namaMerek) {
        this.namaMerek = namaMerek;
    }
}
