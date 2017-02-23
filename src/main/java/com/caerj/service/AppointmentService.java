package com.caerj.service;

import com.caerj.model.Appointment;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Created by nixc1 on 2/23/17.
 */
public interface AppointmentService {
    Appointment findById(Long id);

    void save(Appointment appointment);
    void update(Appointment appointment);
}
