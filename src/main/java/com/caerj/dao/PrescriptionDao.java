package com.caerj.dao;

import com.caerj.model.Prescription;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by nixc1 on 2/28/17.
 */

@Repository
public interface PrescriptionDao extends CrudRepository<Prescription, Long> {
    Prescription findById(Long id);
}