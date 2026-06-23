package com.meubelpendawa.repository;

import com.meubelpendawa.model.Merek;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerekRepository extends JpaRepository<Merek, String> {
    
}
