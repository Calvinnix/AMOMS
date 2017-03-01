package com.caerj.model;

import javax.persistence.*;

/**
 * Created by nixc1 on 2/28/17.
 */

@Entity
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long publicId;

    @Column(unique = true, nullable = false)
    private String name;

    @Column( length = 10000, nullable = false ) //this may need to be expanded
    private String description;

    public Prescription() {
    }

    public Prescription(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Long getPublicId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
