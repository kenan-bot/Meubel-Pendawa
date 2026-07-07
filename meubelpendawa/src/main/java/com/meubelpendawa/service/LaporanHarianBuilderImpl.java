package com.meubelpendawa.service;

import com.meubelpendawa.dto.LaporanHarianDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import com.lowagie.text.Document;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class LaporanHarianBuilderImpl implements LaporanHarianBuilder {

    @Override
    public byte[] generatePdf(LaporanHarianDTO laporan) {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 36, 36, 40, 40);

        try {

            PdfWriter.getInstance(document, outputStream);

            document.open();

            document.add(new Paragraph("TEST LAPORAN HARIAN"));

            document.close();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gagal membuat PDF laporan harian.",
                    e);
        }

        return outputStream.toByteArray();
    }
}