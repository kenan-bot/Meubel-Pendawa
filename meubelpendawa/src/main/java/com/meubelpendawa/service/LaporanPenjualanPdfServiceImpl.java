package com.meubelpendawa.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.meubelpendawa.dto.LaporanPenjualanPdfData;

@Service
public class LaporanPenjualanPdfServiceImpl
                implements LaporanPenjualanPdfService {

        private final EmailService emailService;
        private final LaporanPenjualanService laporanPenjualanService;
        private final LaporanPenjualanPdfGenerator pdfGenerator;

        @Value("${laporan.email.tujuan}")
        private String emailTujuan;

        public LaporanPenjualanPdfServiceImpl(
                        EmailService emailService,
                        LaporanPenjualanService laporanPenjualanService,
                        LaporanPenjualanPdfGenerator pdfGenerator) {

                this.emailService = emailService;
                this.laporanPenjualanService = laporanPenjualanService;
                this.pdfGenerator = pdfGenerator;
        }

        @Override
        public void exportLaporanPenjualan(
                        LocalDateTime startDate,
                        LocalDateTime endDate) {

                Locale locale = Locale.forLanguageTag("id-ID");

                DateTimeFormatter periodeFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", locale);

                DateTimeFormatter cetakFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm", locale);

                //ambil seluruh data laporan
                LaporanPenjualanPdfData laporan = new LaporanPenjualanPdfData();

                laporan.setSummary(
                                laporanPenjualanService.getSummary(
                                                startDate,
                                                endDate));

                laporan.setTopProduk(
                                laporanPenjualanService.getKontribusiProduk(
                                                startDate,
                                                endDate));

                laporan.setTrenPenjualan(
                                laporanPenjualanService.getTrenPenjualan(
                                                startDate,
                                                endDate));

                laporan.setDetailPenjualan(
                                laporanPenjualanService.getDetailPenjualan(
                                                startDate,
                                                endDate));

                //tambahkan informasi PDF
                laporan.setPeriode(
                                startDate.format(periodeFormatter)
                                                + " s/d "
                                                + endDate.format(periodeFormatter));

                laporan.setTanggalCetak(
                                LocalDateTime.now().format(cetakFormatter));

                //generate pdf
                byte[] pdf = pdfGenerator.generate(laporan);

                String subject = "Laporan Penjualan Meubel Pendawa";

                String html = """
                                <html>
                                <body>

                                <h2>Laporan Penjualan Meubel Pendawa</h2>

                                <p>Laporan penjualan berhasil dibuat.</p>

                                <p>File PDF terlampir pada email ini.</p>

                                <hr>

                                <p>Sistem POS Meubel Pendawa</p>

                                </body>
                                </html>
                                """;

                String fileName = "Laporan_Penjualan_"
                                + startDate.toLocalDate()
                                + "_"
                                + endDate.toLocalDate()
                                + ".pdf";

                emailService.sendEmailWithAttachment(
                                emailTujuan,
                                subject,
                                html,
                                fileName,
                                pdf,
                                "application/pdf");

                System.out.println("========================================");
                System.out.println("    LAPORAN PENJUALAN MEUBEL PENDAWA");
                System.out.println("========================================");
                System.out.println("Periode        : " + laporan.getPeriode());
                System.out.println("Total Omzet    : " + laporan.getSummary().getTotalOmzet());
                System.out.println("Total Transaksi: " + laporan.getSummary().getTotalTransaksi());
                System.out.println("========================================");
        }
}