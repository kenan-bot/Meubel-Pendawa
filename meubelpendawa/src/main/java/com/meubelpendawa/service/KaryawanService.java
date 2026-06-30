package com.meubelpendawa.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.repository.KaryawanRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class KaryawanService {

    @Autowired
    private KaryawanRepository karyawanRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    private boolean isValidUsername(String username) {
        return username.matches("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    }

    private boolean isValidPassword(String password) {
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.#_-])[A-Za-z\\d@$!%*?&.#_-]{12,}$");
    }

    private final BCryptPasswordEncoder passwordEncoder =
        new BCryptPasswordEncoder();

    public List<Karyawan> getAllKaryawan() {
        return karyawanRepository.findAll();
    }

    public Karyawan simpanKaryawan(Karyawan karyawan) {

        long nomor = karyawanRepository.count() + 1;
        karyawan.setIdKaryawan(idGeneratorService.generateKaryawanId(nomor));
        
        if (karyawan.getAksesSistem()) {
            if (karyawanRepository.existsByUsername(karyawan.getUsername())) {
                throw new RuntimeException("Username sudah digunakan");
            }

        if (!isValidUsername(karyawan.getUsername())) {
            throw new RuntimeException("Username minimal 8 karakter dan harus mengandung huruf serta angka");
        }
        
        if (!isValidPassword(karyawan.getPassword())) {
            throw new RuntimeException("Password minimal 12 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus");
        }

        karyawan.setPassword(passwordEncoder.encode(karyawan.getPassword()));
    } else {
        karyawan.setRole(null);
        karyawan.setUsername(null);
        karyawan.setPassword(null);
    }
    return karyawanRepository.save(karyawan);

    }


    public Karyawan updateKaryawan(Karyawan karyawan) {
        
        Karyawan dataLama = karyawanRepository.findById(karyawan.getIdKaryawan())
        .orElseThrow(() -> new RuntimeException("Karyawan tidak ditemukan"));

    if (karyawan.getAksesSistem()) {

        if (!isValidUsername(karyawan.getUsername())) {throw new RuntimeException(
            "Username minimal 8 karakter dan harus mengandung huruf serta angka");
        }

        Optional<Karyawan> usernameLama = karyawanRepository.findByUsername(karyawan.getUsername());

        if (usernameLama.isPresent() && !usernameLama.get().getIdKaryawan()
            .equals(karyawan.getIdKaryawan())) {throw new RuntimeException(
        "Username sudah digunakan");
        } 
        
        if (!dataLama.getAksesSistem()) {

            if (karyawan.getPassword() == null || karyawan.getPassword().isBlank()) {
                throw new RuntimeException("Password wajib diisi saat mengaktifkan akses sistem");
            }
        }

        if (karyawan.getPassword() != null && !karyawan.getPassword().isBlank()) {

            if (!isValidPassword(karyawan.getPassword())) {throw new RuntimeException(
                "Password minimal 12 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus");
            }
            
            dataLama.setPassword(passwordEncoder.encode(karyawan.getPassword()));
        }

    } else {
        dataLama.setRole(null);
        dataLama.setUsername(null);
        dataLama.setPassword(null);
    }

    dataLama.setNamaKaryawan(karyawan.getNamaKaryawan());
    dataLama.setEmail(karyawan.getEmail());
    dataLama.setAksesSistem(karyawan.getAksesSistem());
    dataLama.setRole(karyawan.getRole());
    dataLama.setUsername(karyawan.getUsername());
    dataLama.setStatusAktif(karyawan.getStatusAktif());

    return karyawanRepository.save(dataLama);

    }   

    public Karyawan resetPassword(String idKaryawan, String passwordBaru) {
        
        Karyawan karyawan = karyawanRepository.findById(idKaryawan)
        .orElseThrow(() -> new RuntimeException("Karyawan tidak ditemukan"));
        
        if (!isValidPassword(passwordBaru)) {throw new RuntimeException(
            "Password minimal 12 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus");
        }
        
        karyawan.setPassword(passwordEncoder.encode(passwordBaru));  
        return karyawanRepository.save(karyawan);
    }


    public void hapusKaryawan(String idKaryawan) {
        karyawanRepository.deleteById(idKaryawan);
    }

    public List<Karyawan> searchKaryawan(String keyword) {
        return karyawanRepository.findByNamaKaryawanContainingIgnoreCase(keyword);
    }

}
