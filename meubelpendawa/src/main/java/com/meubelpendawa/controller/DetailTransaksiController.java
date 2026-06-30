package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.DetailTransaksi;
import com.meubelpendawa.service.DetailTransaksiService;

@RestController
@RequestMapping("/detail-transaksi")
@CrossOrigin("*")
public class DetailTransaksiController {

    @Autowired
    private DetailTransaksiService detailTransaksiService;

    @GetMapping
    public List<DetailTransaksi> getAllDetailTransaksi() {
        return detailTransaksiService.getAllDetailTransaksi();
    }

    @PostMapping
    public DetailTransaksi tambahDetailTransaksi(@RequestBody DetailTransaksi detailTransaksi) {
        return detailTransaksiService.simpanDetailTransaksi(detailTransaksi);
    }

}