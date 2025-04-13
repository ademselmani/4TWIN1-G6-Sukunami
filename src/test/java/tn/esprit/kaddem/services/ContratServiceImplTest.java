package tn.esprit.spring.kaddem.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.spring.kaddem.entities.Contrat;
import tn.esprit.spring.kaddem.entities.Etudiant;
import tn.esprit.spring.kaddem.entities.Specialite;
import tn.esprit.spring.kaddem.repositories.ContratRepository;
import tn.esprit.spring.kaddem.repositories.EtudiantRepository;

import java.util.Date;
import java.util.Optional;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Active Mockito pour les tests
public class ContratServiceImplTest {

    @Mock
    private ContratRepository contratRepository; // Mock du repository

    @Mock
    private EtudiantRepository etudiantRepository; // Mock du repository étudiant

    @InjectMocks
    private ContratServiceImpl contratService; // Service à tester (avec les mocks injectés)

    private Contrat contrat;
    private Etudiant etudiant;

    @BeforeEach
    void setUp() {
        // Crée un contrat de test
        contrat = new Contrat();
        contrat.setIdContrat(1);
        contrat.setDateDebutContrat(new Date());
        contrat.setDateFinContrat(new Date(System.currentTimeMillis() + 86400000)); // +1 jour
        contrat.setSpecialite(Specialite.IA);
        contrat.setArchive(false);
        contrat.setMontantContrat(1000);

        // Crée un étudiant de test
        etudiant = new Etudiant();
        etudiant.setIdEtudiant(1);
        etudiant.setNomE("Doe");
        etudiant.setPrenomE("John");
    }

    // Test 1: Ajout d'un contrat
    @Test
    void testAddContrat() {
        // Simule le comportement du repository
        when(contratRepository.save(any(Contrat.class))).thenReturn(contrat);

        // Appel de la méthode à tester
        Contrat savedContrat = contratService.addContrat(contrat);

        // Vérifications
        assertNotNull(savedContrat, "Le contrat ne doit pas être null");
        assertEquals(1, savedContrat.getIdContrat(), "L'ID du contrat doit être 1");
        verify(contratRepository, times(1)).save(contrat); // Vérifie que save() est appelé 1 fois
    }

    // Test 2: Récupération d'un contrat par ID
    @Test
    void testRetrieveContrat() {
        // Simule la recherche d'un contrat par ID
        when(contratRepository.findById(1)).thenReturn(Optional.of(contrat));

        // Appel de la méthode à tester
        Contrat foundContrat = contratService.retrieveContrat(1);

        // Vérifications
        assertNotNull(foundContrat, "Le contrat doit être trouvé");
        assertEquals(1, foundContrat.getIdContrat(), "L'ID doit correspondre");
    }

    // Test 3: Suppression d'un contrat
   @Test
void testRemoveContrat() {
    // Arrange
    Contrat contratToDelete = new Contrat();
    contratToDelete.setIdContrat(1);
    when(contratRepository.findById(1)).thenReturn(Optional.of(contratToDelete));
    doNothing().when(contratRepository).delete(contratToDelete);

    // Act
    contratService.removeContrat(1);

    // Assert
    verify(contratRepository, times(1)).delete(contratToDelete);
}
    // Test 4: Affectation d'un contrat à un étudiant
   @Test
    void testAffectContratToEtudiant() {
        // Assurez-vous que l'étudiant a bien un Set de contrats initialisé
        etudiant.setContrats(new HashSet<>());  // Initialisation de l'ensemble des contrats si nécessaire

        // Simule la recherche de l'étudiant et du contrat
        when(etudiantRepository.findByNomEAndPrenomE("Doe", "John")).thenReturn(etudiant);
        when(contratRepository.findByIdContrat(1)).thenReturn(contrat);

        // Appel de la méthode à tester
        Contrat updatedContrat = contratService.affectContratToEtudiant(1, "Doe", "John");

        // Vérifications
        assertNotNull(updatedContrat, "Le contrat doit être mis à jour");
        assertEquals(etudiant, updatedContrat.getEtudiant(), "L'étudiant doit être affecté");
    }
}

