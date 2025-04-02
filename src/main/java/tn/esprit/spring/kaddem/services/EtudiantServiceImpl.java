package tn.esprit.spring.kaddem.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import tn.esprit.spring.kaddem.entities.Contrat;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Equipe;
import tn.esprit.spring.kaddem.entities.Etudiant;
import tn.esprit.spring.kaddem.repositories.ContratRepository;
import tn.esprit.spring.kaddem.repositories.DepartementRepository;
import tn.esprit.spring.kaddem.repositories.EquipeRepository;
import tn.esprit.spring.kaddem.repositories.EtudiantRepository;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Slf4j // Enables Log4j Logging
public class EtudiantServiceImpl implements IEtudiantService {

	@Autowired
	EtudiantRepository etudiantRepository;
	@Autowired
	ContratRepository contratRepository;
	@Autowired
	EquipeRepository equipeRepository;
	@Autowired
	DepartementRepository departementRepository;

	@Override
	public List<Etudiant> retrieveAllEtudiants() {
//		log.info("Fetching all students...");
		return (List<Etudiant>) etudiantRepository.findAll();
	}

	@Override
	public Etudiant addEtudiant(Etudiant e) {
//		log.info("Adding a new student: {} {}", e.getNomE(), e.getPrenomE());
		return etudiantRepository.save(e);
	}

	@Override
	public Etudiant updateEtudiant(Etudiant e) {
//		log.info("Updating student with ID: {}", e.getIdEtudiant());
		return etudiantRepository.save(e);
	}

	@Override
	public Etudiant retrieveEtudiant(Integer idEtudiant) {
//		log.debug("Retrieving student with ID: {}", idEtudiant);
		return etudiantRepository.findById(idEtudiant).orElse(null);
	}

	@Override
	public void removeEtudiant(Integer idEtudiant) {
//		log.warn("Request to delete student with ID: {}", idEtudiant);
		Etudiant e = retrieveEtudiant(idEtudiant);
		if (e != null) {
			etudiantRepository.delete(e);
//			log.info("Student {} deleted successfully.", idEtudiant);
		} else {
//			log.error("Student with ID {} not found!", idEtudiant);
		}
	}

	@Override
	public void assignEtudiantToDepartement(Integer etudiantId, Integer departementId) {
//		log.info("Assigning student {} to department {}", etudiantId, departementId);
		Etudiant etudiant = etudiantRepository.findById(etudiantId).orElse(null);
		Departement departement = departementRepository.findById(departementId).orElse(null);

		if (etudiant != null && departement != null) {
			etudiant.setDepartement(departement);
			etudiantRepository.save(etudiant);
//			log.info("Successfully assigned student {} to department {}", etudiantId, departementId);
		} else {
//			log.error("Error: Student or Department not found!");
		}
	}

	@Transactional
	@Override
	public Etudiant addAndAssignEtudiantToEquipeAndContract(Etudiant e, Integer idContrat, Integer idEquipe) {
//		log.info("Assigning student {} to contract {} and team {}", e.getNomE(), idContrat, idEquipe);

		Contrat c = contratRepository.findById(idContrat).orElse(null);
		Equipe eq = equipeRepository.findById(idEquipe).orElse(null);

		if (c != null && eq != null) {
			c.setEtudiant(e);
			eq.getEtudiants().add(e);
			return etudiantRepository.save(e);
		} else {
//			log.error("Error: Contract or Team not found!");
			return null;
		}
	}

	@Override
	public List<Etudiant> getEtudiantsByDepartement(Integer idDepartement) {
//		log.info("Fetching students from department {}", idDepartement);
		return etudiantRepository.findEtudiantsByDepartement_IdDepart(idDepartement);
	}
}
