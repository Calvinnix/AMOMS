package com.caerj.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by nixc1 on 2/14/17.
 */

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private Boolean gender;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Date dob;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private Integer zipCode;

    @Column(nullable = false)
    private String martialStatus;

    @Column(nullable = false)
    private Integer numOfChildren;

    @Column(nullable = false)
    private Long phoneNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User practitioner;

    private String emailAddress;

}
