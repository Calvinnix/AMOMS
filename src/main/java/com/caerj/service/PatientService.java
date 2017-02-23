package com.caerj.service;

import com.caerj.model.Patient;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by nixc1 on 2/14/17.
 */
public interface PatientService extends UserDetailsService {

    Patient findById(Long id);
    void save(Patient patient);

}
