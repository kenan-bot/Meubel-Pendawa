package com.meubelpendawa.utils;

import java.text.Normalizer;
import java.util.Map;

public final class WilayahUtil {

    private WilayahUtil() {
    }

    public static String cariWilayah(String alamat) {

        if (alamat == null || alamat.isBlank()) {
            return null;
        }

        String hasilNormalisasi = normalisasi(alamat);

        for (Map.Entry<String, String> entry : WilayahAlias.DATA.entrySet()) {

            String keyword = normalisasi(entry.getKey());

            if (hasilNormalisasi.contains(keyword)) {
                return entry.getValue();
            }
        }

        return null;
    }

    private static String normalisasi(String text) {

        if (text == null) {
            return "";
        }

        text = Normalizer.normalize(text, Normalizer.Form.NFD);

        return text
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]", "");
    }
}