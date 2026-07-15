package com.meubelpendawa.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

import javax.imageio.ImageIO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.events.PdfDocumentEvent;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Image;

import com.meubelpendawa.dto.LaporanPenjualanTrenResponse;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;

import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import com.meubelpendawa.dto.KontribusiProdukResponse;
import com.meubelpendawa.dto.LaporanPenjualanDetailResponse;
import com.meubelpendawa.dto.LaporanPenjualanPdfData;
import com.meubelpendawa.dto.LaporanPenjualanSummaryResponse;
import com.itextpdf.kernel.colors.DeviceRgb;

@Service
public class LaporanPenjualanPdfGeneratorImpl
                implements LaporanPenjualanPdfGenerator {

        private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        private static final DeviceRgb ORANGE = new DeviceRgb(249, 115, 22);

        @Override
        public byte[] generate(LaporanPenjualanPdfData data) {

                try {

                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                        PdfWriter writer = new PdfWriter(outputStream);
                        PdfDocument pdf = new PdfDocument(writer);
                        pdf.addEventHandler(PdfDocumentEvent.END_PAGE, new PdfFooterHandler());
                        Document document = new Document(pdf);

                        //header

                        document.add(new Paragraph("LAPORAN PENJUALAN")
                                        .setBold().setFontSize(20).setFontColor(ORANGE)
                                        .setTextAlignment(TextAlignment.CENTER));
                        document.add(new Paragraph("MEUBEL PENDAWA")
                                        .setBold().setTextAlignment(TextAlignment.CENTER));
                        document.add(new Paragraph(" "));

                        document.add(new Paragraph("Periode : " + data.getPeriode()));
                        document.add(new Paragraph("Tanggal Cetak : " + data.getTanggalCetak()));
                        document.add(new Paragraph(" "));

                        // kpi summary

                        document.add(new Paragraph("Ringkasan Penjualan")
                                        .setBold().setFontSize(14).setFontColor(ORANGE));
                        document.add(new Paragraph(" "));

                        if (data.getSummary() == null) {
                                throw new RuntimeException(
                                                "Summary laporan tidak ditemukan");
                        }
                        LaporanPenjualanSummaryResponse summary = data.getSummary();

                        Table kpiTable = new Table(UnitValue.createPercentArray(new float[] { 50, 50 }))
                                        .useAllAvailableWidth();

                        //total omzet
                        kpiTable.addCell(new Cell().add(new Paragraph("Total Omzet"))
                                        .add(new Paragraph(formatRupiah(summary.getTotalOmzet())).setBold()));

                        //total transaksi
                        kpiTable.addCell(new Cell().add(new Paragraph("Total Transaksi"))
                                        .add(new Paragraph(String.valueOf(summary.getTotalTransaksi())).setBold()));

                        //produk terjual
                        kpiTable.addCell(new Cell().add(new Paragraph("Produk Terjual"))
                                        .add(new Paragraph(String.valueOf(summary.getProdukTerjual())).setBold()));

                        //rata-rata pembelian
                        kpiTable.addCell(new Cell().add(new Paragraph("Rata-rata Pembelian"))
                                        .add(new Paragraph(formatRupiah(summary.getRataRataPembelian())).setBold()));

                        document.add(kpiTable);

                        document.add(new Paragraph("Metode Pembayaran")
                                        .setBold().setFontSize(14).setFontColor(ORANGE));

                        document.add(new Paragraph(" "));

                        Table pembayaranTable = new Table(UnitValue.createPercentArray(new float[] { 50, 50 }))
                                        .useAllAvailableWidth();

                        pembayaranTable.addCell(new Cell().add(new Paragraph("Cash"))
                                        .add(new Paragraph(formatRupiah(summary.getCash())).setBold()));

                        pembayaranTable.addCell(new Cell().add(new Paragraph("Cashless"))
                                        .add(new Paragraph(formatRupiah(summary.getCashless())).setBold()));

                        document.add(pembayaranTable);

                        document.add(new Paragraph(" "));

                        // top 5 produk

                        document.add(new Paragraph("Kontribusi Produk")
                                        .setBold().setFontSize(14).setFontColor(ORANGE));

                        document.add(new Paragraph(" "));

                        Table produkTable = new Table(UnitValue.createPercentArray(new float[] { 60, 20, 20 }))
                                        .useAllAvailableWidth();

                        produkTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Produk").setBold().setFontColor(ColorConstants.WHITE)));

                        produkTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Terjual").setBold().setFontColor(ColorConstants.WHITE)));

                        produkTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Persentase").setBold().setFontColor(ColorConstants.WHITE)));

                        if (data.getTopProduk() != null) {

                                for (KontribusiProdukResponse produk : data.getTopProduk()) {
                                        produkTable.addCell(
                                                        produk.getNamaProduk() != null ? produk.getNamaProduk() : "-");
                                        produkTable.addCell(String.valueOf(produk.getTotalTerjual()));
                                        produkTable.addCell(produk.getPersentase() != null ? String.format(
                                                        "%.2f%%", produk.getPersentase()) : "0%");
                                }
                        }

                        document.add(produkTable);

                        document.add(new Paragraph(" "));

                        //grafik tren penjualan

                        document.add(new Paragraph("Tren Penjualan").setBold().setFontSize(14)
                                        .setFontColor(ORANGE));
                        document.add(createTrendChart(data));

                        document.add(new AreaBreak());

                        // detail penjualan

                        document.add(new Paragraph(" "));

                        Table detailTable = new Table(
                                        UnitValue.createPercentArray(new float[] { 5, 15, 18, 22, 25, 15 }))
                                        .useAllAvailableWidth();

                        detailTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("No").setBold().setFontColor(ColorConstants.WHITE)));

                        detailTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Tanggal").setBold().setFontColor(ColorConstants.WHITE)));

                        detailTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Order ID").setBold().setFontColor(ColorConstants.WHITE)));

                        detailTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Pemesan").setBold().setFontColor(ColorConstants.WHITE)));

                        detailTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Produk").setBold().setFontColor(ColorConstants.WHITE)));

                        detailTable.addHeaderCell(new Cell().setBackgroundColor(ORANGE)
                                        .add(new Paragraph("Total").setBold().setFontColor(ColorConstants.WHITE)));

                        if (data.getDetailPenjualan() != null && !data.getDetailPenjualan().isEmpty()) {
                                document.add(new Paragraph("Detail Penjualan").setBold().setFontSize(14).setFontColor(ORANGE));

                                for (LaporanPenjualanDetailResponse detail : data.getDetailPenjualan()) {

                                        detailTable.addCell(detail.getNo() != null
                                                        ? String.valueOf(detail.getNo())
                                                        : "-");
                                        detailTable.addCell(detail.getTanggal() != null
                                                        ? detail.getTanggal().format(DATE_FORMAT)
                                                        : "-");

                                        detailTable.addCell(detail.getOrderId() != null
                                                        ? detail.getOrderId()
                                                        : "-");

                                        detailTable.addCell(detail.getPemesan() != null
                                                        ? detail.getPemesan()
                                                        : "-");

                                        detailTable.addCell(detail.getProduk() != null
                                                        ? detail.getProduk()
                                                        : "-");

                                        detailTable.addCell(formatRupiah(detail.getTotal()));
                                }
                        }
                        document.add(detailTable);
                        document.close();

                        return outputStream.toByteArray();

                } catch (Exception e) {
                        throw new RuntimeException(
                                        "Gagal generate PDF", e);
                }
        }

        private Image createTrendChart(
                        LaporanPenjualanPdfData data) {

                try {
                        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
                        if (data.getTrenPenjualan() != null) {
                                for (LaporanPenjualanTrenResponse tren : data.getTrenPenjualan()) {
                                        dataset.addValue(tren.getOmzet() != null
                                                        ? tren.getOmzet()
                                                        : 0, "Omzet",
                                                        tren.getLabel() != null
                                                                        ? tren.getLabel()
                                                                        : "-");
                                }
                        }

                        JFreeChart chart = ChartFactory.createLineChart("Tren Penjualan","Periode","Omzet",dataset);

                        BufferedImage image = chart.createBufferedImage(800,350);

                        ByteArrayOutputStream baos = new ByteArrayOutputStream();

                        ImageIO.write(image,"png",baos);

                        Image chartImage = new Image(ImageDataFactory.create(baos.toByteArray()));

                        chartImage.scaleToFit(500, 250);

                        return chartImage;

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Gagal membuat grafik",
                                        e);
                }
        }

        private String formatRupiah(Double nominal) {

                if (nominal == null) {
                        return "Rp 0";
                }

                return "Rp " + String.format("%,.0f", nominal).replace(",", ".");
        }

}