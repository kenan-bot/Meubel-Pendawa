package com.meubelpendawa.service;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import com.meubelpendawa.model.DetailTransaksi;
import com.meubelpendawa.model.Transaksi;
import com.meubelpendawa.repository.DetailTransaksiRepository;
import com.meubelpendawa.repository.TransaksiRepository;

/**
 * Generate struk (nota) PDF untuk 1 transaksi, dan kirim struk itu lewat email.
 *
 * Dipakai di 2 tempat:
 *  1. TransaksiController -> GET /transaksi/{orderId}/struk, supaya kasir bisa
 *     buka/cetak/download PDF-nya langsung dari browser.
 *  2. TransaksiService -> otomatis dipanggil begitu status pembayaran sebuah
 *     order jadi SUCCESS, untuk kirim salinan struk ke email toko.
 */
@Service
public class StrukService {

    private static final Logger log = LoggerFactory.getLogger(StrukService.class);

    private static final DateTimeFormatter FORMAT_TANGGAL =
            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    @Autowired
    private TransaksiRepository transaksiRepository;

    @Autowired
    private DetailTransaksiRepository detailTransaksiRepository;

    @Autowired
    private EmailService emailService;

    // Alamat email toko yang menerima notifikasi/salinan struk setiap ada pesanan baru.
    @Value("${struk.email-tujuan:meubelpendawa@gmail.com}")
    private String emailTujuanStruk;

    private String rupiah(Double nominal) {
        NumberFormat format = NumberFormat.getInstance(new Locale("in", "ID"));
        format.setMaximumFractionDigits(0);
        return "Rp" + format.format(nominal == null ? 0 : nominal);
    }

    /**
     * Generate isi PDF struk untuk 1 orderId. Dipakai baik untuk endpoint cetak
     * maupun untuk lampiran email.
     */
    public byte[] generateStrukPdf(String orderId) {
        Transaksi t = transaksiRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
        List<DetailTransaksi> items = detailTransaksiRepository.findByTransaksi_OrderId(orderId);

        try {
            Document document = new Document(PageSize.A5, 24, 24, 24, 24);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontJudul = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font fontSubJudul = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font fontLabel = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA, 10);
            Font fontTotal = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            Paragraph judul = new Paragraph("MEUBEL PENDAWA", fontJudul);
            judul.setAlignment(Element.ALIGN_CENTER);
            document.add(judul);

            Paragraph subJudul = new Paragraph("Struk Pembayaran / Nota Pesanan", fontSubJudul);
            subJudul.setAlignment(Element.ALIGN_CENTER);
            subJudul.setSpacingAfter(12);
            document.add(subJudul);

            document.add(garis());

            document.add(baris("No. Order", t.getOrderId(), fontLabel, fontNormal));
            document.add(baris("Tanggal", t.getTanggalTransaksi() != null
                    ? t.getTanggalTransaksi().format(FORMAT_TANGGAL) : "-", fontLabel, fontNormal));
            document.add(baris("Nama Pemesan", t.getNamaPemesan(), fontLabel, fontNormal));
            document.add(baris("No. WhatsApp", t.getNoWhatsapp(), fontLabel, fontNormal));
            document.add(baris("Metode Pengiriman",
                    "DELIVERY".equalsIgnoreCase(t.getMetodePengiriman()) ? "Delivery" : "Pick Up",
                    fontLabel, fontNormal));
            if ("DELIVERY".equalsIgnoreCase(t.getMetodePengiriman())) {
                document.add(baris("Alamat", t.getAlamatPengiriman(), fontLabel, fontNormal));
                if (t.getDriver() != null) {
                    document.add(baris("Driver", t.getDriver().getNamaKaryawan(), fontLabel, fontNormal));
                }
            }
            document.add(baris("Metode Pembayaran",
                    "CASH".equalsIgnoreCase(t.getMetodePembayaran()) ? "Cash" : "Cashless (QRIS)",
                    fontLabel, fontNormal));
            document.add(baris("Status Pembayaran", t.getStatusPembayaran(), fontLabel, fontNormal));

            Paragraph spacer = new Paragraph(" ");
            spacer.setSpacingAfter(4);
            document.add(spacer);
            document.add(garis());

            // ----- Tabel item pesanan -----
            PdfPTable table = new PdfPTable(new float[]{4f, 1f, 2f, 2f});
            table.setWidthPercentage(100);
            table.setSpacingBefore(8);
            table.setSpacingAfter(8);

            table.addCell(headerCell("Produk", fontLabel));
            table.addCell(headerCell("Qty", fontLabel));
            table.addCell(headerCell("Harga", fontLabel));
            table.addCell(headerCell("Subtotal", fontLabel));

            for (DetailTransaksi d : items) {
                table.addCell(dataCell(d.getNamaProduk(), fontNormal, Element.ALIGN_LEFT));
                table.addCell(dataCell(String.valueOf(d.getQty()), fontNormal, Element.ALIGN_CENTER));
                table.addCell(dataCell(rupiah(d.getHargaJual()), fontNormal, Element.ALIGN_RIGHT));
                table.addCell(dataCell(rupiah(d.getSubtotal()), fontNormal, Element.ALIGN_RIGHT));
            }
            document.add(table);

            document.add(garis());

            document.add(barisTotal("Total Pesanan", rupiah(t.getTotalPesanan()), fontTotal));
            document.add(baris("Jumlah Bayar", rupiah(t.getJumlahBayar()), fontLabel, fontNormal));
            document.add(baris("Kembalian", rupiah(t.getKembalian()), fontLabel, fontNormal));

            Paragraph footer = new Paragraph("\nTerima kasih telah berbelanja di Meubel Pendawa.",
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(16);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Gagal membuat struk PDF untuk order " + orderId, e);
        }
    }

    private Paragraph garis() {
        Paragraph p = new Paragraph(new Chunk(new com.lowagie.text.pdf.draw.LineSeparator()));
        return p;
    }

    private Paragraph baris(String label, String isi, Font fontLabel, Font fontNormal) {
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + ": ", fontLabel));
        p.add(new Chunk(isi == null ? "-" : isi, fontNormal));
        p.setSpacingAfter(2);
        return p;
    }

    private Paragraph barisTotal(String label, String isi, Font font) {
        Paragraph p = new Paragraph(label + ": " + isi, font);
        p.setSpacingAfter(4);
        return p;
    }

    private PdfPCell headerCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(4);
        cell.setBackgroundColor(new java.awt.Color(240, 240, 240));
        return cell;
    }

    private PdfPCell dataCell(String text, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(4);
        cell.setHorizontalAlignment(align);
        return cell;
    }

    /**
     * Generate struk PDF untuk orderId lalu kirim ke email toko (struk.email-tujuan,
     * default meubelpendawa@gmail.com). Dipanggil otomatis begitu status pembayaran
     * sebuah order berhasil (SUCCESS) -- baik dari pembayaran CASH maupun CASHLESS.
     *
     * Sengaja menelan (catch) semua exception di sini dan cuma log error -- gagal
     * kirim email TIDAK BOLEH menggagalkan proses pembayaran yang sudah berhasil.
     */
    public void kirimStrukEmail(String orderId) {
        try {
            Transaksi t = transaksiRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan"));
            byte[] pdf = generateStrukPdf(orderId);

            String subject = "Struk Pesanan Baru - " + orderId;
            String html = """
                    <html>
                    <body style="font-family: Arial, sans-serif; font-size: 14px; color:#333;">
                        <h2 style="color:#5F04E8;">Pesanan Baru Diterima</h2>
                        <p>Order <b>%s</b> atas nama <b>%s</b> telah berhasil dibayar.</p>
                        <table cellpadding="4" style="border-collapse: collapse;">
                            <tr><td>No. Order</td><td>: %s</td></tr>
                            <tr><td>Nama Pemesan</td><td>: %s</td></tr>
                            <tr><td>No. WhatsApp</td><td>: %s</td></tr>
                            <tr><td>Metode Pengiriman</td><td>: %s</td></tr>
                            <tr><td>Metode Pembayaran</td><td>: %s</td></tr>
                            <tr><td>Total Pesanan</td><td>: %s</td></tr>
                        </table>
                        <p>Detail lengkap ada pada struk PDF terlampir.</p>
                    </body>
                    </html>
                    """.formatted(
                    t.getOrderId(),
                    t.getNamaPemesan(),
                    t.getOrderId(),
                    t.getNamaPemesan(),
                    t.getNoWhatsapp(),
                    "DELIVERY".equalsIgnoreCase(t.getMetodePengiriman()) ? "Delivery" : "Pick Up",
                    "CASH".equalsIgnoreCase(t.getMetodePembayaran()) ? "Cash" : "Cashless (QRIS)",
                    rupiah(t.getTotalPesanan()));

            emailService.sendEmailWithAttachment(
                    emailTujuanStruk,
                    subject,
                    html,
                    "Struk-" + orderId + ".pdf",
                    pdf,
                    "application/pdf");

            log.info("Struk order {} berhasil dikirim ke {}", orderId, emailTujuanStruk);
        } catch (Exception e) {
            log.error("Gagal mengirim struk email untuk order {}: {}", orderId, e.getMessage(), e);
        }
    }
}
