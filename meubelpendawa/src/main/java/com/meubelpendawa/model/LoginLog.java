package com.meubelpendawa.model;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
@Table(name = "loginlog")
@Getter 
@Setter 
@NoArgsConstructor
public class LoginLog {

    @Id
    private String idLog;

    @ManyToOne
    @JoinColumn(name = "idKaryawan")
    private Karyawan karyawan;

    private LocalDateTime loginAt;

    private LocalDateTime logoutAt;

    private Boolean loginDiluarJamOperasional;

    private Boolean logoutDiluarJamOperasional;

   

    public LoginLog(Karyawan karyawan,
                    LocalDateTime loginAt,
                    LocalDateTime logoutAt,
                    Boolean loginDiluarJamOperasional,
                    Boolean logoutDiluarJamOperasional) {

        this.karyawan = karyawan;
        this.loginAt = loginAt;
        this.logoutAt = logoutAt;
        this.loginDiluarJamOperasional = loginDiluarJamOperasional;
        this.logoutDiluarJamOperasional = logoutDiluarJamOperasional;
    }

    
}