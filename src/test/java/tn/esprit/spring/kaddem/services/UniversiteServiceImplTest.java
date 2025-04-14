package tn.esprit.spring.kaddem.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Universite;
import tn.esprit.spring.kaddem.repositories.DepartementRepository;
import tn.esprit.spring.kaddem.repositories.UniversiteRepository;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UniversiteServiceImplTest {

    @Mock
    private UniversiteRepository universiteRepository;

    @Mock
    private DepartementRepository departementRepository;

    @InjectMocks
    private UniversiteServiceImpl universiteService;

    private Universite universite;
    private Departement departement;
    private List<Universite> universiteList;
    private Set<Departement> departementSet;

    @BeforeEach
    void setUp() {
        // Initialize test data
        universite = new Universite(1, "Test University");
        departement = new Departement(1, "Test Department");
        
        universiteList = new ArrayList<>();
        universiteList.add(universite);
        
        departementSet = new HashSet<>();
        departementSet.add(departement);
        
        universite.setDepartements(departementSet);
    }

    @Test
    void testRetrieveAllUniversites() {
        // Given
        when(universiteRepository.findAll()).thenReturn(universiteList);
        
        // When
        List<Universite> result = universiteService.retrieveAllUniversites();
        
        // Then
        assertEquals(1, result.size());
        assertEquals("Test University", result.get(0).getNomUniv());
        verify(universiteRepository, times(1)).findAll();
    }

    @Test
    void testAddUniversite() {
        // Given
        when(universiteRepository.save(any(Universite.class))).thenReturn(universite);
        
        // When
        Universite result = universiteService.addUniversite(universite);
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getIdUniv());
        assertEquals("Test University", result.getNomUniv());
        verify(universiteRepository, times(1)).save(universite);
    }

    @Test
    void testUpdateUniversite() {
        // Given
        Universite updatedUniversite = new Universite(1, "Updated University");
        when(universiteRepository.findById(1)).thenReturn(Optional.of(universite));
        when(universiteRepository.save(any(Universite.class))).thenReturn(updatedUniversite);
        
        // When
        Universite result = universiteService.updateUniversite(updatedUniversite);
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getIdUniv());
        assertEquals("Updated University", result.getNomUniv());
        verify(universiteRepository, times(1)).findById(1);
        verify(universiteRepository, times(1)).save(updatedUniversite);
    }

    @Test
    void testRetrieveUniversite() {
        // Given
        when(universiteRepository.findById(1)).thenReturn(Optional.of(universite));
        
        // When
        Universite result = universiteService.retrieveUniversite(1);
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getIdUniv());
        assertEquals("Test University", result.getNomUniv());
        verify(universiteRepository, times(1)).findById(1);
    }

    @Test
    void testDeleteUniversite() {
        // Given
        when(universiteRepository.findById(1)).thenReturn(Optional.of(universite));
        doNothing().when(universiteRepository).delete(universite);
        
        // When
        universiteService.deleteUniversite(1);
        
        // Then
        verify(universiteRepository, times(1)).findById(1);
        verify(universiteRepository, times(1)).delete(universite);
    }

    @Test
    void testAssignUniversiteToDepartement() {
        // Given
        when(universiteRepository.findById(1)).thenReturn(Optional.of(universite));
        when(departementRepository.findById(1)).thenReturn(Optional.of(departement));
        when(universiteRepository.save(universite)).thenReturn(universite);
        
        // Clear departments to start with empty set
        universite.setDepartements(new HashSet<>());
        
        // When
        universiteService.assignUniversiteToDepartement(1, 1);
        
        // Then
        verify(universiteRepository, times(1)).findById(1);
        verify(departementRepository, times(1)).findById(1);
        verify(universiteRepository, times(1)).save(universite);
        assertEquals(1, universite.getDepartements().size());
    }

    @Test
    void testRetrieveDepartementsByUniversite() {
        // Given
        when(universiteRepository.findById(1)).thenReturn(Optional.of(universite));
        
        // When
        Set<Departement> result = universiteService.retrieveDepartementsByUniversite(1);
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.contains(departement));
        verify(universiteRepository, times(1)).findById(1);
    }
} 