package tn.esprit.spring.kaddem;

import org.junit.jupiter.api.Test;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Etudiant;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DepartementTest {

    @Test
    public void testConstructorAndGetters() {
        Departement departement = new Departement(1, "Informatique");

        assertEquals(1, departement.getIdDepart());
        assertEquals("Informatique", departement.getNomDepart());
    }

    @Test
    public void testSetters() {
        Departement departement = new Departement();
        departement.setIdDepart(2);
        departement.setNomDepart("Maths");

        assertEquals(2, departement.getIdDepart());
        assertEquals("Maths", departement.getNomDepart());
    }

    @Test
    public void testEtudiantsSetterAndGetter() {
        Departement departement = new Departement();
        Set<Etudiant> etudiants = new HashSet<>();
        departement.setEtudiants(etudiants);

        assertEquals(etudiants, departement.getEtudiants());
    }
}
