package tn.esprit.spring.kaddem.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Universite;
import tn.esprit.spring.kaddem.repositories.DepartementRepository;
import tn.esprit.spring.kaddem.repositories.UniversiteRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UniversiteServiceIntegrationTest {

    @Autowired
    private IUniversiteService universiteService;

    @Autowired
    private UniversiteRepository universiteRepository;

    @Autowired
    private DepartementRepository departementRepository;

    @Test
    void testAddAndRetrieveUniversite() {
        // Given
        Universite universite = new Universite();
        universite.setNomUniv("Integration Test University");

        // When
        Universite savedUniversite = universiteService.addUniversite(universite);
        Universite retrievedUniversite = universiteService.retrieveUniversite(savedUniversite.getIdUniv());

        // Then
        assertNotNull(retrievedUniversite);
        assertNotNull(retrievedUniversite.getIdUniv());
        assertEquals("Integration Test University", retrievedUniversite.getNomUniv());
    }

    @Test
    void testUpdateUniversite() {
        // Given
        Universite universite = new Universite();
        universite.setNomUniv("Original Name");
        Universite savedUniversite = universiteService.addUniversite(universite);

        // When
        savedUniversite.setNomUniv("Updated Name");
        Universite updatedUniversite = universiteService.updateUniversite(savedUniversite);

        // Then
        assertEquals("Updated Name", updatedUniversite.getNomUniv());
        assertEquals(savedUniversite.getIdUniv(), updatedUniversite.getIdUniv());
    }

    @Test
    void testRetrieveAllUniversites() {
        // Given
        universiteRepository.deleteAll();  // Clear existing universities
        
        Universite universite1 = new Universite();
        universite1.setNomUniv("University 1");
        universiteService.addUniversite(universite1);
        
        Universite universite2 = new Universite();
        universite2.setNomUniv("University 2");
        universiteService.addUniversite(universite2);

        // When
        List<Universite> universities = universiteService.retrieveAllUniversites();

        // Then
        assertEquals(2, universities.size());
        assertTrue(universities.stream().anyMatch(u -> u.getNomUniv().equals("University 1")));
        assertTrue(universities.stream().anyMatch(u -> u.getNomUniv().equals("University 2")));
    }

    @Test
    void testDeleteUniversite() {
        // Given
        Universite universite = new Universite();
        universite.setNomUniv("To Be Deleted");
        Universite savedUniversite = universiteService.addUniversite(universite);
        Integer idToDelete = savedUniversite.getIdUniv();

        // When
        universiteService.deleteUniversite(idToDelete);

        // Then
        List<Universite> allUniversities = universiteService.retrieveAllUniversites();
        assertTrue(allUniversities.stream().noneMatch(u -> u.getIdUniv().equals(idToDelete)));
    }

    @Test
    void testAssignUniversiteToDepartement() {
        // Given
        Universite universite = new Universite();
        universite.setNomUniv("Test University");
        universite.setDepartements(new HashSet<>());
        Universite savedUniversite = universiteService.addUniversite(universite);

        Departement departement = new Departement();
        departement.setNomDepart("Test Department");
        Departement savedDepartement = departementRepository.save(departement);

        // When
        universiteService.assignUniversiteToDepartement(savedUniversite.getIdUniv(), savedDepartement.getIdDepart());

        // Then
        Set<Departement> departments = universiteService.retrieveDepartementsByUniversite(savedUniversite.getIdUniv());
        assertEquals(1, departments.size());
        assertTrue(departments.stream().anyMatch(d -> d.getIdDepart().equals(savedDepartement.getIdDepart())));
    }

    @Test
    void testRetrieveDepartementsByUniversite() {
        // Given
        Universite universite = new Universite();
        universite.setNomUniv("University with Departments");
        universite.setDepartements(new HashSet<>());
        Universite savedUniversite = universiteService.addUniversite(universite);

        Departement departement1 = new Departement();
        departement1.setNomDepart("Department 1");
        Departement savedDepartement1 = departementRepository.save(departement1);

        Departement departement2 = new Departement();
        departement2.setNomDepart("Department 2");
        Departement savedDepartement2 = departementRepository.save(departement2);

        universiteService.assignUniversiteToDepartement(savedUniversite.getIdUniv(), savedDepartement1.getIdDepart());
        universiteService.assignUniversiteToDepartement(savedUniversite.getIdUniv(), savedDepartement2.getIdDepart());

        // When
        Set<Departement> retrievedDepartements = universiteService.retrieveDepartementsByUniversite(savedUniversite.getIdUniv());

        // Then
        assertEquals(2, retrievedDepartements.size());
        assertTrue(retrievedDepartements.stream().anyMatch(d -> d.getNomDepart().equals("Department 1")));
        assertTrue(retrievedDepartements.stream().anyMatch(d -> d.getNomDepart().equals("Department 2")));
    }
} 