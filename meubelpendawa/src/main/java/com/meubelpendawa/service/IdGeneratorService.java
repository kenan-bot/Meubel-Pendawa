package com.meubelpendawa.service;

import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class IdGeneratorService {

    public String generateKategoriId(long nomor) {
        return String.format("KTG%03d", nomor);
    }

    public String generateMerekId(long nomor) {
        return String.format("MRK%03d", nomor);
    }

    public String generateProdukId(long nomor) {
        return String.format("PRD%03d", nomor);
    }

    public String generateKaryawanId(long nomor) {
        return String.format("KRY%03d", nomor);
    }

    public String generateDetailTransaksiId(long nomor) {
        return String.format("DTL%03d", nomor);
    }

    public String generatePengirimanId(long nomor) {
        return String.format("PNG%03d", nomor);
    }

    public String generateLoginLogId(long nomor) {
        return String.format("LOG%03d", nomor);
    }

    public String generateOrderId(String prefix, long jumlahHariIni) {
        return prefix + String.format("%03d", jumlahHariIni + 1);
    }
}
