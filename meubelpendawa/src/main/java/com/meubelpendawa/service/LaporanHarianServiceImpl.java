package com.meubelpendawa.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meubelpendawa.dto.DetailLaporanHarianDTO;
import com.meubelpendawa.dto.LaporanHarianDTO;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.repository.TransaksiRepository;
import java.nio.charset.StandardCharsets;

@Service
public class LaporanHarianServiceImpl implements LaporanHarianService {

        private final EmailService emailService;
        private final TransaksiRepository transaksiRepository;
        private final LaporanHarianPdfGenerator pdfGenerator;

        @Value("${laporan.email.tujuan}")
        private String emailTujuan;

        public LaporanHarianServiceImpl(
                        EmailService emailService,
                        TransaksiRepository transaksiRepository,
                        LaporanHarianPdfGenerator pdfGenerator) {

                this.emailService = emailService;
                this.transaksiRepository = transaksiRepository;
                this.pdfGenerator = pdfGenerator;
        }

        @Override
        public void exportLaporanHarian() {

                // Mengambil seluruh transaksi SUCCESS pada hari ini
                LocalDate hariIni = LocalDate.now();

                LocalDateTime awalHari = hariIni.atStartOfDay();
                LocalDateTime akhirHari = hariIni.atTime(LocalTime.MAX);

                List<Transaksi> transaksiHariIni = transaksiRepository.findByTanggalTransaksiBetweenAndStatusPembayaran(
                                awalHari,
                                akhirHari,
                                "SUCCESS");

                // Menghitung ringkasan laporan

                double totalCash = 0;
                double totalCashless = 0;

                for (Transaksi transaksi : transaksiHariIni) {

                        double total = transaksi.getTotalPesanan() == null
                                        ? 0
                                        : transaksi.getTotalPesanan();

                        if ("CASH".equalsIgnoreCase(transaksi.getMetodePembayaran())) {
                                totalCash += total;
                        } else {
                                totalCashless += total;
                        }
                }

                double totalPemasukan = totalCash + totalCashless;
                int jumlahTransaksi = transaksiHariIni.size();

                LaporanHarianDTO laporan = new LaporanHarianDTO();

                laporan.setCash(BigDecimal.valueOf(totalCash));
                laporan.setCashless(BigDecimal.valueOf(totalCashless));
                laporan.setTotalPemasukan(BigDecimal.valueOf(totalPemasukan));
                laporan.setJumlahTransaksi(jumlahTransaksi);

                List<DetailLaporanHarianDTO> detailList = new ArrayList<>();
                int nomor = 1;

                // Mapping transaksi ke DTO

                for (Transaksi transaksi : transaksiHariIni) {

                        double total = transaksi.getTotalPesanan() == null
                                        ? 0
                                        : transaksi.getTotalPesanan();

                        DetailLaporanHarianDTO detail = new DetailLaporanHarianDTO();

                        detail.setNo(nomor++);

                        detail.setOrderId(
                                        transaksi.getOrderId());

                        detail.setTanggalTransaksi(
                                        transaksi.getTanggalTransaksi());

                        detail.setNamaPemesan(
                                        transaksi.getNamaPemesan());

                        detail.setMetodePembayaran(
                                        transaksi.getMetodePembayaran());

                        detail.setMetodePengiriman(
                                        transaksi.getMetodePengiriman());

                        detail.setTotalPesanan(
                                        BigDecimal.valueOf(total));

                        detailList.add(detail);
                }

                // Generate PDF
                laporan.setTransaksi(detailList);

                byte[] pdf = pdfGenerator.generate(laporan);

                String subject = "Laporan Harian Meubel Pendawa";

                String html = """
                                <html>
                                <body>

                                <h2>Laporan Harian Meubel Pendawa</h2>

                                <p>Laporan harian berhasil dibuat.</p>

                                <p>File PDF terlampir pada email ini.</p>

                                <hr>

                                <p>Sistem POS Meubel Pendawa</p>

                                </body>
                                </html>
                                """;

                emailService.sendEmailWithAttachment(
                                emailTujuan,
                                subject,
                                html,
                                "Laporan_Harian.pdf",
                                pdf,
                                "application/pdf");

                System.out.println("========================================");
                System.out.println("      LAPORAN HARIAN MEUBEL PENDAWA");
                System.out.println("========================================");
                System.out.println("Jumlah Data      : " + jumlahTransaksi);
                System.out.println("Pemasukan Cash   : " + totalCash);
                System.out.println("Pemasukan QRIS   : " + totalCashless);
                System.out.println("Total Pemasukan  : " + totalPemasukan);
                System.out.println("========================================");
        }

}