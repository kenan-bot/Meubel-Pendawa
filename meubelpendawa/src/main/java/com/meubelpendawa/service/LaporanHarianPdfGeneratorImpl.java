package com.meubelpendawa.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.meubelpendawa.dto.DetailLaporanHarianDTO;
import com.meubelpendawa.dto.LaporanHarianDTO;

@Service
public class LaporanHarianPdfGeneratorImpl
        implements LaporanHarianPdfGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMMM yyyy");

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    public byte[] generate(LaporanHarianDTO laporan) {

        try {

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4, 36, 36, 40, 36);

            PdfWriter.getInstance(document, outputStream);

            document.open();

            tambahHeader(document);

            tambahRingkasan(document, laporan);

            tambahTabel(document, laporan);

            tambahFooter(document);

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gagal membuat PDF laporan harian.",
                    e);

        }
    }


    //header

    private void tambahHeader(Document document)
            throws DocumentException {

        Font title = new Font(Font.HELVETICA, 18, Font.BOLD);

        Font subtitle = new Font(Font.HELVETICA, 11);

        Paragraph p1 = new Paragraph("LAPORAN HARIAN", title);

        p1.setAlignment(Element.ALIGN_CENTER);

        document.add(p1);

        Paragraph p2 = new Paragraph("MEUBEL PENDAWA", title);

        p2.setAlignment(Element.ALIGN_CENTER);

        document.add(p2);

        document.add(new Paragraph(" "));

        Paragraph tanggal = new Paragraph(
                "Tanggal : "
                        + java.time.LocalDate.now().format(DATE_FORMAT),
                subtitle);

        document.add(tanggal);

        document.add(new Paragraph(" "));
    }


    //ringkasan

    private void tambahRingkasan(
            Document document,
            LaporanHarianDTO laporan)
            throws DocumentException {

        Font heading = new Font(Font.HELVETICA, 13, Font.BOLD);

        document.add(new Paragraph("Ringkasan", heading));

        document.add(new Paragraph(" "));

        document.add(new Paragraph(
                "Cash : "
                        + rupiah(laporan.getCash())));

        document.add(new Paragraph(
                "Cashless : "
                        + rupiah(laporan.getCashless())));

        document.add(new Paragraph(
                "Jumlah Transaksi : "
                        + laporan.getJumlahTransaksi()));

        document.add(new Paragraph(
                "Total Pemasukan : "
                        + rupiah(laporan.getTotalPemasukan())));

        document.add(new Paragraph(" "));
    }

  
    //tabel

    private void tambahTabel(
            Document document,
            LaporanHarianDTO laporan)
            throws DocumentException {

        Font heading = new Font(Font.HELVETICA, 13, Font.BOLD);

        document.add(
                new Paragraph(
                        "Daftar Transaksi Hari Ini",
                        heading));

        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(7);

        table.setWidthPercentage(100);

        table.setWidths(new float[] {
                1f,
                2.5f,
                1.5f,
                3f,
                2f,
                2f,
                2f
        });

        addHeader(table, "No");
        addHeader(table, "Order ID");
        addHeader(table, "Waktu");
        addHeader(table, "Pemesan");
        addHeader(table, "Pembayaran");
        addHeader(table, "Pengiriman");
        addHeader(table, "Total");

        for (DetailLaporanHarianDTO d : laporan.getTransaksi()) {

            table.addCell(String.valueOf(d.getNo()));

            table.addCell(d.getOrderId());

            table.addCell(
                    d.getTanggalTransaksi()
                            .format(TIME_FORMAT));

            table.addCell(d.getNamaPemesan());

            table.addCell(d.getMetodePembayaran());

            table.addCell(d.getMetodePengiriman());

            table.addCell(rupiah(d.getTotalPesanan()));
        }

        document.add(table);

        document.add(new Paragraph(" "));
    }

    
    //footer

    private void tambahFooter(Document document)
            throws DocumentException {

        Font footer = new Font(Font.HELVETICA, 10);

        document.add(new Paragraph(
                "Dicetak : "
                        + java.time.LocalDateTime.now()));

        document.add(new Paragraph(" "));

        Paragraph p = new Paragraph(
                "Sistem POS Meubel Pendawa",
                footer);

        p.setAlignment(Element.ALIGN_CENTER);

        document.add(p);
    }

    
    //header tabel

    private void addHeader(
            PdfPTable table,
            String text) {

        PdfPCell cell = new PdfPCell(new Phrase(text));

        cell.setHorizontalAlignment(
                Element.ALIGN_CENTER);

        cell.setVerticalAlignment(
                Element.ALIGN_MIDDLE);

        cell.setPadding(5);

        table.addCell(cell);
    }

    
    //format rupiah

    private String rupiah(BigDecimal value) {

        if (value == null) {
            return "Rp0";
        }

        return "Rp"
                + String.format("%,.0f", value)
                        .replace(',', '.');
    }

}