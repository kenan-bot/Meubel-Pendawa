package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Merek;
import com.meubelpendawa.service.MerekService;
import com.meubelpendawa.repository.ProdukRepository;
import java.util.Map;

@RestController
@RequestMapping("/merek")
@CrossOrigin("*")
public class MerekController {

    @Autowired
    private MerekService merekService;

    @Autowired
    private ProdukRepository produkRepository;

    @GetMapping
    public List<Merek> getAllMerek() {
        return merekService.getAllMerek();
    }

    @GetMapping("/{idMerek}/is-used")
    public Map<String, Boolean> isUsed(
            @PathVariable String idMerek) {

        return Map.of(
                "used",
                produkRepository.existsByMerek_IdMerek(idMerek));
    }

    @GetMapping("/{idMerek}/usage-count")
    public Long getUsageCount(
            @PathVariable String idMerek) {

        return produkRepository.countByMerek_IdMerek(idMerek);
    }

    @PostMapping
    public Merek tambahMerek(@RequestBody Merek merek) {
        return merekService.simpanMerek(merek);
    }

    @PutMapping
    public Merek updateMerek(@RequestBody Merek merek) {
        return merekService.updateMerek(merek);
    }

    @DeleteMapping("/{id}")
    public void hapusMerek(@PathVariable String id) {
        merekService.hapusMerek(id);
    }

}
