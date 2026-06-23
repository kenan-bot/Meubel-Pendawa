package com.meubelpendawa.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.meubelpendawa.model.Merek;
import com.meubelpendawa.service.MerekService;

@RestController
@RequestMapping("/merek")
@CrossOrigin("*")
public class MerekController {

    @Autowired
    private MerekService merekService;

    @GetMapping
    public List<Merek> getAllMerek() {
        return merekService.getAllMerek();
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
