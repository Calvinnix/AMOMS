package com.caerj.dao;

import com.caerj.model.Appointment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by nixc1 on 2/23/17.
 */

@Repository
public interface AppointmentDao extends CrudRepository<Appointment, Long> {
    Appointment findById(Long id);
}
