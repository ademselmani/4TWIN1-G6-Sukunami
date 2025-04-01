package tn.esprit.spring.kaddem.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import tn.esprit.spring.kaddem.entities.Contrat;
import tn.esprit.spring.kaddem.entities.Equipe;
import tn.esprit.spring.kaddem.entities.Etudiant;
import tn.esprit.spring.kaddem.entities.Niveau;
import tn.esprit.spring.kaddem.repositories.EquipeRepository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Slf4j
@AllArgsConstructor
@Service
public class EquipeServiceImpl implements IEquipeService{
	EquipeRepository equipeRepository;

	public List<Equipe> retrieveAllEquipes(){
		log.info("Récupération de toutes les équipes");
		return (List<Equipe>) equipeRepository.findAll();
	}

	public Equipe addEquipe(Equipe e){
		log.info("Ajout d'une nouvelle équipe: {}", e);
		Equipe savedEquipe = equipeRepository.save(e);
		log.info("Équipe ajoutée avec succès: {}", savedEquipe);
		return savedEquipe;
	}

	public void deleteEquipe(Integer idEquipe){
		log.info("Suppression de l'équipe avec ID: {}", idEquipe);
		Equipe e = retrieveEquipe(idEquipe);
		equipeRepository.delete(e);
		log.info("Équipe supprimée avec succès");
	}

	public Equipe retrieveEquipe(Integer equipeId){
		log.info("Récupération de l'équipe avec ID: {}", equipeId);
		return equipeRepository.findById(equipeId).orElse(null);
	}

	public Equipe updateEquipe(Equipe e){
		log.info("Mise à jour de l'équipe: {}", e);
		Equipe updatedEquipe = equipeRepository.save(e);
		log.info("Équipe mise à jour avec succès: {}", updatedEquipe);
		return updatedEquipe;
	}

	public void evoluerEquipes(){
		log.info("Début du processus d'évolution des équipes");
		List<Equipe> equipes = (List<Equipe>) equipeRepository.findAll();
		for (Equipe equipe : equipes) {
			if (equipe.getNiveau().equals(Niveau.JUNIOR) || equipe.getNiveau().equals(Niveau.SENIOR)) {
				log.debug("Traitement de l'équipe: {} avec niveau {}", equipe.getIdEquipe(), equipe.getNiveau());
				List<Etudiant> etudiants = (List<Etudiant>) equipe.getEtudiants();
				int nbEtudiantsAvecContratsActifs = 0;

				for (Etudiant etudiant : etudiants) {
					Set<Contrat> contrats = etudiant.getContrats();
					for (Contrat contrat : contrats) {
						Date dateSysteme = new Date();
						long difference_In_Time = dateSysteme.getTime() - contrat.getDateFinContrat().getTime();
						long difference_In_Years = (difference_In_Time / (1000L * 60 * 60 * 24 * 365));

						if (!contrat.getArchive() && difference_In_Years > 1) {
							nbEtudiantsAvecContratsActifs++;
							log.debug("Étudiant {} a un contrat actif depuis plus d'un an", etudiant.getEquipes());
							break;
						}
					}
					if (nbEtudiantsAvecContratsActifs >= 3) break;
				}

				if (nbEtudiantsAvecContratsActifs >= 3){
					if (equipe.getNiveau().equals(Niveau.JUNIOR)){
						equipe.setNiveau(Niveau.SENIOR);
						equipeRepository.save(equipe);
						log.info("L'équipe {} passe de JUNIOR à SENIOR", equipe.getIdEquipe());
					} else if (equipe.getNiveau().equals(Niveau.SENIOR)){
						equipe.setNiveau(Niveau.EXPERT);
						equipeRepository.save(equipe);
						log.info("L'équipe {} passe de SENIOR à EXPERT", equipe.getIdEquipe());
					}
				}
			}
		}
		log.info("Fin du processus d'évolution des équipes");
	}
}