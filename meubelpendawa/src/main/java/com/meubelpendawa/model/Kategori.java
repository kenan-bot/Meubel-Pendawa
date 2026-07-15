package com.meubelpendawa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "kategori")
@Getter 
@Setter 
@NoArgsConstructor
public class Kategori {

    @Id
    private String idKategori;

    private String namaKategori;

    public Kategori(String namaKategori) {
        this.namaKategori = namaKategori;
    }

    
}