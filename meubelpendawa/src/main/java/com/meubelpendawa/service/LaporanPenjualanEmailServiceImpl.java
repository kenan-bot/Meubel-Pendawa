package com.meubelpendawa.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.meubelpendawa.dto.LaporanPenjualanPdfData;

@Service
public class LaporanPenjualanEmailServiceImpl
        implements LaporanPenjualanEmailService {

    private final LaporanPenjualanService laporanService;
    private final LaporanPenjualanPdfGenerator pdfGenerator;
    private final EmailService emailService;

    public LaporanPenjualanEmailServiceImpl(
            LaporanPenjualanService laporanService,
            LaporanPenjualanPdfGenerator pdfGenerator,
            EmailService emailService) {

        this.laporanService = laporanService;
        this.pdfGenerator = pdfGenerator;
        this.emailService = emailService;
    }

    @Override
    public void kirimLaporan(
            String emailTujuan,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        Locale locale = Locale.forLanguageTag("id-ID");

        DateTimeFormatter periodeFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", locale);

        DateTimeFormatter cetakFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm", locale);

        LaporanPenjualanPdfData data = new LaporanPenjualanPdfData();

        data.setPeriode(
                startDate.format(periodeFormatter)
                        + " s/d "
                        + endDate.format(periodeFormatter));

        data.setTanggalCetak(
                LocalDateTime.now().format(cetakFormatter));

        data.setSummary(
                laporanService.getSummary(startDate, endDate));

        data.setTopProduk(
                laporanService.getKontribusiProduk(startDate, endDate));

        data.setTrenPenjualan(
                laporanService.getTrenPenjualan(startDate, endDate));

        data.setDetailPenjualan(
                laporanService.getDetailPenjualan(startDate, endDate));

        byte[] pdf = pdfGenerator.generate(data);

        String html = """
                <h2>Laporan Penjualan Meubel Pendawa</h2>

                <p>Halo,</p>

                <p>
                Laporan penjualan yang Anda minta telah berhasil dibuat.
                Silakan lihat file PDF yang terlampir pada email ini.
                </p>

                <br>

                <table cellpadding="6">
                    <tr>
                        <td><b>Periode</b></td>
                        <td>:</td>
                        <td>%s</td>
                    </tr>
                    <tr>
                        <td><b>Tanggal Cetak</b></td>
                        <td>:</td>
                        <td>%s</td>
                    </tr>
                </table>

                <br>

                <p>
                Email ini dikirim secara otomatis oleh Sistem Meubel Pendawa.
                </p>
                """
                .formatted(
                        data.getPeriode(),
                        data.getTanggalCetak());

        String fileName = "Laporan-Penjualan-"
                + startDate.toLocalDate()
                + "-"
                + endDate.toLocalDate()
                + ".pdf";

        emailService.sendEmailWithAttachment(
                emailTujuan,
                "Laporan Penjualan Meubel Pendawa",
                html,
                fileName,
                pdf,
                "application/pdf");
    }
}