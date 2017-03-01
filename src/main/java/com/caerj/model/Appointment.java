package com.caerj.model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by nixc1 on 2/23/17.
 */

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long publicId;

    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User practitioner;

    private String practitionerName;

    private String patientName;

    @Column( length = 10000 ) //this may need to be expanded
    private String notes;

    private String date;

    private String startTime;

    private String endTime;

    @Column( length = 10000 ) //this may need to be expanded
    private String reasonForVisit;

    private String checkInTime;

    private String sessionStartTime;

    private String sessionEndTime;

    @OneToMany
    @JoinColumn(name = "prescription_id")
    private List<Prescription> prescriptions;

    public Appointment() {
    }

    public Appointment(Patient patient, User practitioner, String date, String startTime, String endTime, String reasonForVisit) {
        this.patient = patient;
        this.practitioner = practitioner;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.reasonForVisit = reasonForVisit;
        this.notes = notes;
    }

    public Appointment(Patient patient, User practitioner, String date, String startTime, String endTime, String reasonForVisit, String notes) {
        this.patient = patient;
        this.practitioner = practitioner;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.reasonForVisit = reasonForVisit;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPublicId() {
        return id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public User getPractitioner() {
        return practitioner;
    }

    public void setPractitioner(User practitioner) {
        this.practitioner = practitioner;
    }

    public String getPractitionerName() {
        if (this.practitioner != null) {
            return this.practitioner.getUsername();
        } else {
            return "";
        }
    }

    public String getPatientName() {
        String fullName = "";
        if (this.patient != null) {
            fullName = this.patient.getFirstName() + " " +
                       this.patient.getMiddleName() + " " +
                       this.patient.getLastName();
        }
        return fullName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getReasonForVisit() {
        return reasonForVisit;
    }

    public void setReasonForVisit(String reasonForVisit) {
        this.reasonForVisit = reasonForVisit;
    }

    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }

    public String getSessionStartTime() {
        return sessionStartTime;
    }

    public void setSessionStartTime(String sessionStartTime) {
        this.sessionStartTime = sessionStartTime;
    }

    public String getSessionEndTime() {
        return sessionEndTime;
    }

    public void setSessionEndTime(String sessionEndTime) {
        this.sessionEndTime = sessionEndTime;
    }

    public List<Prescription> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<Prescription> prescriptions) {
        this.prescriptions = prescriptions;
    }
}
