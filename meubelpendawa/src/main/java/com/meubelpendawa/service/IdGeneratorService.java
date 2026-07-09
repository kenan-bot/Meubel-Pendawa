package com.meubelpendawa.service;

import org.springframework.stereotype.Service;

@Service
public class IdGeneratorService {

    public String generateNextId(String lastId, String prefix) {

        if (lastId == null || lastId.isBlank()) {
            return prefix + "001";
        }

        int nomor = Integer.parseInt(lastId.substring(prefix.length()));

        return String.format("%s%03d", prefix, nomor + 1);
    }

    public String generateNextOrderId(String prefix, String lastOrderId) {

        if (lastOrderId == null || !lastOrderId.startsWith(prefix)) {
            return prefix + "001";
        }

        int nomor = Integer.parseInt(
                lastOrderId.substring(prefix.length()));

        return prefix + String.format("%03d", nomor + 1);
    }

}