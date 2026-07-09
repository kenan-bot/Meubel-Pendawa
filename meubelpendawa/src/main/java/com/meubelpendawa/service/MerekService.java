package com.meubelpendawa.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.meubelpendawa.model.Merek;
import com.meubelpendawa.repository.MerekRepository;

@Service
public class MerekService {

    @Autowired
    private MerekRepository merekRepository;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public List<Merek> getAllMerek() {
        return merekRepository.findAll();
    }

    public Merek simpanMerek(Merek merek) {

        Merek lastMerek = merekRepository.findFirstByOrderByIdMerekDesc();

        String lastId = lastMerek == null
                ? null
                : lastMerek.getIdMerek();

        merek.setIdMerek(
                idGeneratorService.generateNextId(lastId, "MRK"));

        return merekRepository.save(merek);
    }

    public Merek updateMerek(Merek merek) {
        return merekRepository.save(merek);
    }

    public void hapusMerek(String idMerek) {
        merekRepository.deleteById(idMerek);
    }

}
