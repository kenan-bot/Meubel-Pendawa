package com.meubelpendawa.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.repository.TransaksiRepository;
import com.meubelpendawa.model.Pengiriman;
import com.meubelpendawa.repository.PengirimanRepository;

@Service
public class TransaksiService {

    @Autowired
    private TransaksiRepository transaksiRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    @Autowired
    private PengirimanRepository pengirimanRepository;

    public List<Transaksi> getAllTransaksi() {
        return transaksiRepository.findAll();
    }

    public Transaksi simpanTransaksi(Transaksi transaksi) {

        String lastOrderId = transaksiRepository.findTopByOrderByOrderIdDesc()
                .map(Transaksi::getOrderId)
                .orElse(null);

        transaksi.setOrderId(idGeneratorService.generateOrderId(lastOrderId));
        transaksi.setTanggalTransaksi(LocalDateTime.now());

        transaksi.setTotalPesanan(0.0);
        transaksi.setKembalian(0.0);

        Transaksi transaksiTersimpan = transaksiRepository.save(transaksi);
        
        
        if ("DELIVERY".equalsIgnoreCase(transaksi.getMetodePengiriman())) {
            
            Pengiriman pengiriman = new Pengiriman();
            long nomorPengiriman = pengirimanRepository.count() + 1;
            pengiriman.setIdPengiriman(idGeneratorService.generatePengirimanId(nomorPengiriman));
            pengiriman.setTransaksi(transaksiTersimpan);
            pengiriman.setDriver(transaksi.getDriver());
            pengiriman.setStatusPengiriman("ON_PROCESS");
            pengirimanRepository.save(pengiriman);
        }
        
        return transaksiTersimpan;
    }

    public Transaksi prosesPembayaran(String orderId, Double jumlahBayar) {
        Transaksi transaksi = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
        if (jumlahBayar < transaksi.getTotalPesanan()) {
            throw new RuntimeException("Jumlah bayar kurang dari total pesanan");
        }
        transaksi.setJumlahBayar(jumlahBayar);
        transaksi.setKembalian(jumlahBayar - transaksi.getTotalPesanan());

        return transaksiRepository.save(transaksi);

    }

    public List<Transaksi> searchTransaksi(String keyword) {
        return transaksiRepository.findByNamaPemesanContainingIgnoreCaseOrOrderIdContainingIgnoreCase(keyword, keyword);
    }
}


