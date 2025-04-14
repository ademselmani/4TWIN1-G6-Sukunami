package tn.esprit.spring.kaddem.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
public class Universite implements Serializable{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer idUniv;
    private String nomUniv;
    private String imagePath;
    @Column(length = 1000)
    private String description;
    private String location;
    
    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Departement> departements;
    
    public Universite() {
        // TODO Auto-generated constructor stub
    }

    public Universite(String nomUniv) {
        super();
        this.nomUniv = nomUniv;
    }

    public Universite(Integer idUniv, String nomUniv) {
        super();
        this.idUniv = idUniv;
        this.nomUniv = nomUniv;
    }
    
    public Universite(String nomUniv, String imagePath, String description, String location) {
        super();
        this.nomUniv = nomUniv;
        this.imagePath = imagePath;
        this.description = description;
        this.location = location;
    }

    public Set<Departement> getDepartements() {
        return departements;
    }

    public void setDepartements(Set<Departement> departements) {
        this.departements = departements;
    }

    public Integer getIdUniv() {
        return idUniv;
    }
    
    public void setIdUniv(Integer idUniv) {
        this.idUniv = idUniv;
    }
    
    public String getNomUniv() {
        return nomUniv;
    }
    
    public void setNomUniv(String nomUniv) {
        this.nomUniv = nomUniv;
    }
    
    public String getImagePath() {
        return imagePath;
    }
    
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
}
