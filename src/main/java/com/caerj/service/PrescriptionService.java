package com.caerj.service;

import com.caerj.model.Prescription;

/**
 * Created by nixc1 on 2/28/17.
 */
public interface PrescriptionService {
    Prescription findById(Long id);
    void save(Prescription prescription);
    void update(Prescription prescription);
}