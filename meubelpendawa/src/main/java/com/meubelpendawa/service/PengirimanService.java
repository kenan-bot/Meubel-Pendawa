package com.meubelpendawa.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Pengiriman;
import com.meubelpendawa.repository.PengirimanRepository;
import java.time.LocalDateTime;

@Service
public class PengirimanService {

    @Autowired
    private PengirimanRepository pengirimanRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public List<Pengiriman> getAllPengiriman() {
        return pengirimanRepository.findAll();
    }

    public Pengiriman simpanPengiriman(Pengiriman pengiriman) {

        long nomor = pengirimanRepository.count() + 1;
        pengiriman.setIdPengiriman(idGeneratorService.generatePengirimanId(nomor));
        return pengirimanRepository.save(pengiriman);
    }

    public Pengiriman updatePengiriman(Pengiriman pengiriman) {
        return pengirimanRepository.save(pengiriman);
    }

    public void hapusPengiriman(String idPengiriman) {
        pengirimanRepository.deleteById(idPengiriman);
    }

    public List<Pengiriman> getPengirimanByDriver(String idKaryawan) {
        return pengirimanRepository.findByDriver_IdKaryawan(idKaryawan);
    }

    public Pengiriman updateStatus(String idPengiriman, String statusBaru) {

    Pengiriman pengiriman = pengirimanRepository.findById(idPengiriman)
        .orElseThrow(() -> new RuntimeException("Pengiriman tidak ditemukan"));

    if ("COMPLETED".equals(pengiriman.getStatusPengiriman())) {
        throw new RuntimeException("Pengiriman sudah selesai dan tidak dapat diubah");
    }

    if (!"COMPLETED".equals(statusBaru)) {
        throw new RuntimeException("Status hanya boleh diubah menjadi COMPLETED");
    }

    pengiriman.setStatusPengiriman("COMPLETED");

    // simpan waktu selesai
    pengiriman.setTanggalSelesai(LocalDateTime.now());

    return pengirimanRepository.save(pengiriman);
}

}
