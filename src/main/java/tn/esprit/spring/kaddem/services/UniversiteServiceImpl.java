package tn.esprit.spring.kaddem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Universite;
import tn.esprit.spring.kaddem.repositories.DepartementRepository;
import tn.esprit.spring.kaddem.repositories.UniversiteRepository;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.NoSuchElementException;

@Service
@Slf4j
public class UniversiteServiceImpl implements IUniversiteService{
@Autowired
    UniversiteRepository universiteRepository;
@Autowired
    DepartementRepository departementRepository;
    public UniversiteServiceImpl() {
        // TODO Auto-generated constructor stub
    }
  public   List<Universite> retrieveAllUniversites(){
    log.info("Fetching all universities...");
    return (List<Universite>) universiteRepository.findAll();
    }

 public    Universite addUniversite (Universite u){
    if (u == null) {
        log.error("Cannot add null university");
        throw new IllegalArgumentException("University cannot be null");
    }
    
    // Validate required fields
    if (u.getNomUniv() == null || u.getNomUniv().trim().isEmpty()) {
        log.error("Cannot add university with empty name");
        throw new IllegalArgumentException("University name cannot be empty");
    }
    
    // Trim string values to ensure they're not exceeding DB limits
    if (u.getImagePath() != null && u.getImagePath().length() > 2000) {
        log.warn("Image URL too long ({}), truncating to 2000 characters", u.getImagePath().length());
        u.setImagePath(u.getImagePath().substring(0, 2000));
    }
    
    if (u.getDescription() != null && u.getDescription().length() > 1000) {
        log.warn("Description too long ({}), truncating to 1000 characters", u.getDescription().length());
        u.setDescription(u.getDescription().substring(0, 1000));
    }
    
    log.info("Adding a new university: {}", u.getNomUniv());
    return (universiteRepository.save(u));
}

 public    Universite updateUniversite (Universite u){
    if (u == null) {
       log.error("Cannot update null university");
       throw new IllegalArgumentException("University cannot be null");
    }
    if (u.getIdUniv() == null) {
       log.error("Cannot update university with null ID");
       throw new IllegalArgumentException("University ID cannot be null for update operation");
    }
    
    // Check if university exists before updating
    try {
        universiteRepository.findById(u.getIdUniv())
            .orElseThrow(() -> new NoSuchElementException("University with ID " + u.getIdUniv() + " not found"));
    } catch (NoSuchElementException e) {
        log.error("University with ID {} not found for update", u.getIdUniv());
        throw e;
    }
    
    // Trim string values to ensure they're not exceeding DB limits
    if (u.getImagePath() != null && u.getImagePath().length() > 2000) {
        log.warn("Image URL too long ({}), truncating to 2000 characters", u.getImagePath().length());
        u.setImagePath(u.getImagePath().substring(0, 2000));
    }
    
    if (u.getDescription() != null && u.getDescription().length() > 1000) {
        log.warn("Description too long ({}), truncating to 1000 characters", u.getDescription().length());
        u.setDescription(u.getDescription().substring(0, 1000));
    }
    
    log.info("Updating university with ID: {}", u.getIdUniv());
    return (universiteRepository.save(u));
}

  public Universite retrieveUniversite (Integer idUniversite){
    if (idUniversite == null) {
        log.error("Cannot retrieve university with null ID");
        throw new IllegalArgumentException("University ID cannot be null");
    }
    log.info("Retrieving university with ID: {}", idUniversite);
    try {
        return universiteRepository.findById(idUniversite)
            .orElseThrow(() -> new NoSuchElementException("University with ID " + idUniversite + " not found"));
    } catch (NoSuchElementException e) {
        log.error("University with ID {} not found", idUniversite);
        throw e;
    }
  }
    
  public void deleteUniversite(Integer idUniversite){
    if (idUniversite == null) {
        log.error("Cannot delete university with null ID");
        throw new IllegalArgumentException("University ID cannot be null");
    }
    log.info("Deleting university with ID: {}", idUniversite);
    try {
        Universite universite = retrieveUniversite(idUniversite);
        universiteRepository.delete(universite);
        log.info("University with ID {} deleted successfully", idUniversite);
    } catch (NoSuchElementException e) {
        log.error("Cannot delete - university with ID {} not found", idUniversite);
        throw e;
    }
  }

  public void assignUniversiteToDepartement(Integer idUniversite, Integer idDepartement){
    if (idUniversite == null || idDepartement == null) {
        log.error("Cannot assign university to department with null IDs");
        throw new IllegalArgumentException("University ID and Department ID cannot be null");
    }
    log.info("Assigning university ID: {} to department ID: {}", idUniversite, idDepartement);
    
    Universite universite = universiteRepository.findById(idUniversite)
        .orElseThrow(() -> {
            log.error("University with ID {} not found", idUniversite);
            return new NoSuchElementException("University with ID " + idUniversite + " not found");
        });
        
    Departement departement = departementRepository.findById(idDepartement)
        .orElseThrow(() -> {
            log.error("Department with ID {} not found", idDepartement);
            return new NoSuchElementException("Department with ID " + idDepartement + " not found");
        });
    
    // Initialize departments set if null
    if (universite.getDepartements() == null) {
        universite.setDepartements(new HashSet<>());
    }
    
    universite.getDepartements().add(departement);
    universiteRepository.save(universite);
    log.info("Department with ID {} successfully assigned to university with ID {}", idDepartement, idUniversite);
  }

  public Set<Departement> retrieveDepartementsByUniversite(Integer idUniversite){
    if (idUniversite == null) {
        log.error("Cannot retrieve departments with null university ID");
        throw new IllegalArgumentException("University ID cannot be null");
    }
    log.info("Retrieving departments for university ID: {}", idUniversite);
    
    Universite universite = universiteRepository.findById(idUniversite)
        .orElseThrow(() -> {
            log.error("University with ID {} not found", idUniversite);
            return new NoSuchElementException("University with ID " + idUniversite + " not found");
        });
    
    if (universite.getDepartements() == null) {
        log.info("No departments found for university ID: {}", idUniversite);
        return Collections.emptySet();
    }
    
    return universite.getDepartements();
  }
}
