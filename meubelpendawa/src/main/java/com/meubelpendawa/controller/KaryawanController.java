package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Karyawan;
import com.meubelpendawa.service.KaryawanService;
import com.meubelpendawa.dto.ResetPasswordRequest;


@RestController
@RequestMapping("/karyawan")
@CrossOrigin("*")
public class KaryawanController {

    @Autowired
    private KaryawanService karyawanService;

    @GetMapping
    public List<Karyawan> getAllKaryawan() {
        return karyawanService.getAllKaryawan();
    }

    @GetMapping("/search")
    public List<Karyawan> searchKaryawan(@RequestParam String keyword) {
        return karyawanService.searchKaryawan(keyword);
    }

    @PostMapping
    public Karyawan tambahKaryawan(@RequestBody Karyawan karyawan) {
        return karyawanService.simpanKaryawan(karyawan);
    }

    @PutMapping
    public Karyawan updateKaryawan(@RequestBody Karyawan karyawan) {
        return karyawanService.updateKaryawan(karyawan);
    }

    @PutMapping("/{idKaryawan}/reset-password")
    public Karyawan resetPassword(@PathVariable String idKaryawan, @RequestBody ResetPasswordRequest request) {
        return karyawanService.resetPassword(idKaryawan, request.getPasswordBaru());
    }

    @DeleteMapping("/{id}")
    public void hapusKaryawan(@PathVariable String id) {
        karyawanService.hapusKaryawan(id);
    }
}