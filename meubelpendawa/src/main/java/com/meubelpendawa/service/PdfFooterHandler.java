package com.meubelpendawa.service;

import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;

import com.itextpdf.kernel.geom.Rectangle;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;

import com.itextpdf.kernel.pdf.canvas.PdfCanvas;

import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.element.Paragraph;

import com.itextpdf.layout.properties.TextAlignment;

public class PdfFooterHandler implements IEventHandler {

    @Override
    public void handleEvent(Event event) {

        PdfDocumentEvent docEvent = (PdfDocumentEvent) event;

        PdfDocument pdf = docEvent.getDocument();

        PdfPage page = docEvent.getPage();

        int pageNumber = pdf.getPageNumber(page);

        Rectangle pageSize = page.getPageSize();

        PdfCanvas pdfCanvas = new PdfCanvas(
                page.newContentStreamAfter(),
                page.getResources(),
                pdf);

        Canvas canvas = new Canvas(
                pdfCanvas,
                pageSize);

        canvas.showTextAligned(
                new Paragraph(
                        "Meubel Pendawa | Halaman " + pageNumber),
                pageSize.getWidth() / 2,
                20,
                TextAlignment.CENTER);

        canvas.close();
    }
}