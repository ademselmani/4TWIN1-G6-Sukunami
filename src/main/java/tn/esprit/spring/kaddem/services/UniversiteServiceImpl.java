package tn.esprit.spring.kaddem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Universite;
import tn.esprit.spring.kaddem.repositories.DepartementRepository;
import tn.esprit.spring.kaddem.repositories.UniversiteRepository;

import java.util.List;
import java.util.Set;

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

 public    Universite addUniversite (Universite  u){
    log.info("Adding a new university: {}", u.getNomUniv());
    return  (universiteRepository.save(u));
    }

 public    Universite updateUniversite (Universite  u){
     log.info("Updating university with ID: {}", u.getIdUniv());
     return  (universiteRepository.save(u));
    }

  public Universite retrieveUniversite (Integer idUniversite){
    log.info("Retrieving university with ID: {}", idUniversite);
    Universite u = universiteRepository.findById(idUniversite).get();
    return  u;
    }
    public  void deleteUniversite(Integer idUniversite){
        log.info("Deleting university with ID: {}", idUniversite);
        universiteRepository.delete(retrieveUniversite(idUniversite));
    }

    public void assignUniversiteToDepartement(Integer idUniversite, Integer idDepartement){
        log.info("Assigning university ID: {} to department ID: {}", idUniversite, idDepartement);
        Universite u= universiteRepository.findById(idUniversite).orElse(null);
        Departement d= departementRepository.findById(idDepartement).orElse(null);
        u.getDepartements().add(d);
        universiteRepository.save(u);
    }

    public Set<Departement> retrieveDepartementsByUniversite(Integer idUniversite){
        log.info("Retrieving departments for university ID: {}", idUniversite);
        Universite u=universiteRepository.findById(idUniversite).orElse(null);
        return u.getDepartements();
    }
}
