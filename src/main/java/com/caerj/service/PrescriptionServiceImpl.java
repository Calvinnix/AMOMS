package com.caerj.service;

import com.caerj.dao.PrescriptionDao;
import com.caerj.model.Prescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by nixc1 on 2/28/17.
 */
@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionDao prescriptionDao;

    private static final Logger logger = LoggerFactory.getLogger(PrescriptionServiceImpl.class);

    @Override
    public Prescription findById(Long id) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        Prescription prescription = prescriptionDao.findById(id);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
        return prescription;
    }

    @Override
    public void save(Prescription prescription) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        logger.info(" --- Saving prescription");
        prescriptionDao.save(prescription);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }

    @Override
    public void update(Prescription prescription) {
        logger.info(String.format(" --- Entering: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));

        Prescription prescriptionFound = prescriptionDao.findById(prescription.getId());
        if (prescriptionFound != null) {
            logger.info(" --- Mapping edited prescription to the existing prescription.");
            prescription.setId(prescriptionFound.getId());
        }

        prescriptionDao.save(prescription);

        logger.info(String.format(" --- Exiting: %s", Thread.currentThread().getStackTrace()[1].getMethodName()));
    }
}
