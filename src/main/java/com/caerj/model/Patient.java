package com.caerj.model;

import java.util.List;
import javax.persistence.*;

/**
 * Created by nixc1 on 2/14/17.
 */

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String publicId;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private Boolean gender;

    @Column(nullable = false)
    private String dob;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private Integer zipCode;

    @Column(nullable = false)
    private String maritalStatus;

    @Column(nullable = false)
    private Integer numOfChildren;

    @Column(nullable = false)
    private Long phoneNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User practitioner;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id")
    private List<Appointment> appointments;

    @Column
    private String practitionerName;

    private String emailAddress;


    public Patient(String firstName, String middleName, String lastName, Boolean gender, String dob, String address, String city, String state, Integer zipCode, String maritalStatus, Integer numOfChildren, Long phoneNumber, User practitioner, String practitionerName, String emailAddress) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.gender = gender;
        this.dob = dob;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.maritalStatus = maritalStatus;
        this.numOfChildren = numOfChildren;
        this.phoneNumber = phoneNumber;
        this.practitioner = practitioner;
        this.practitionerName = practitionerName;
        this.emailAddress = emailAddress;
    }

    public Patient() {
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getZipCode() {
        return zipCode;
    }

    public void setZipCode(Integer zipCode) {
        this.zipCode = zipCode;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public Integer getNumOfChildren() {
        return numOfChildren;
    }

    public void setNumOfChildren(Integer numOfChildren) {
        this.numOfChildren = numOfChildren;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public User getPractitioner() {
        return practitioner;
    }

    public void setPractitioner(User practitioner) {
        this.practitioner = practitioner;
    }

    public String getPractitionerName() {
        return practitionerName;
    }

    public void setPractitionerName(String practitionerName) {
        this.practitionerName = practitionerName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }
}
