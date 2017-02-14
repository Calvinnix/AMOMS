package com.caerj.dao;

import com.caerj.model.Patient;
import org.springframework.data.repository.CrudRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

/**
 * Created by nixc1 on 2/14/17.
 */

@Repository
public interface PatientDao extends CrudRepository<Patient, Long> {

    Patient findById(Long id);

    @PreAuthorize("hasAuthority('ROLE_ADMIN') || hasAuthority('ROLE_RECEPTIONIST')")
    @Override
    void delete(Long aLong);

}
