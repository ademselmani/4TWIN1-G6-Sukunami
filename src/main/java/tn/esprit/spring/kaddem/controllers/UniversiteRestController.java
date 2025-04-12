package tn.esprit.spring.kaddem.controllers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.kaddem.entities.Departement;
import tn.esprit.spring.kaddem.entities.Universite;
import tn.esprit.spring.kaddem.services.IUniversiteService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/universite")
@Slf4j
public class UniversiteRestController {
	@Autowired
	IUniversiteService universiteService;
	// http://localhost:8089/Kaddem/universite/retrieve-all-universites
	@GetMapping("/retrieve-all-universites")
	public ResponseEntity<List<Universite>> getUniversites() {
		try {
			List<Universite> listUniversites = universiteService.retrieveAllUniversites();
			return new ResponseEntity<>(listUniversites, HttpStatus.OK);
		} catch (Exception e) {
			log.error("Error retrieving all universities: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	// http://localhost:8089/Kaddem/universite/retrieve-universite/8
	@GetMapping("/retrieve-universite/{universite-id}")
	public ResponseEntity<Universite> retrieveUniversite(@PathVariable("universite-id") Integer universiteId) {
		try {
			Universite universite = universiteService.retrieveUniversite(universiteId);
			return new ResponseEntity<>(universite, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			log.error("University not found with ID {}: {}", universiteId, e.getMessage());
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (IllegalArgumentException e) {
			log.error("Invalid argument when retrieving university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("Error retrieving university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// http://localhost:8089/Kaddem/universite/add-universite
	@PostMapping("/add-universite")
	public ResponseEntity<Universite> addUniversite(@RequestBody Universite u) {
		try {
			Universite universite = universiteService.addUniversite(u);
			return new ResponseEntity<>(universite, HttpStatus.CREATED);
		} catch (IllegalArgumentException e) {
			log.error("Invalid university data: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("Error adding university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// http://localhost:8089/Kaddem/universite/remove-universite/1
	@DeleteMapping("/remove-universite/{universite-id}")
	public ResponseEntity<Void> removeUniversite(@PathVariable("universite-id") Integer universiteId) {
		try {
			universiteService.deleteUniversite(universiteId);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (NoSuchElementException e) {
			log.error("University not found for deletion with ID {}: {}", universiteId, e.getMessage());
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (IllegalArgumentException e) {
			log.error("Invalid argument when deleting university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("Error deleting university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// http://localhost:8089/Kaddem/universite/update-universite
	@PutMapping("/update-universite")
	public ResponseEntity<Universite> updateUniversite(@RequestBody Universite u) {
		try {
			Universite updatedUniversite = universiteService.updateUniversite(u);
			return new ResponseEntity<>(updatedUniversite, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			log.error("University not found for update: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (IllegalArgumentException e) {
			log.error("Invalid university data for update: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("Error updating university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	//@PutMapping("/affecter-etudiant-departement")
	@PutMapping(value="/affecter-universite-departement/{universiteId}/{departementId}")
	public ResponseEntity<Void> affectertUniversiteToDepartement(
			@PathVariable("universiteId") Integer universiteId, 
			@PathVariable("departementId") Integer departementId) {
		try {
			universiteService.assignUniversiteToDepartement(universiteId, departementId);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			log.error("University or department not found: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (IllegalArgumentException e) {
			log.error("Invalid argument when assigning university to department: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("Error assigning university to department: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/listerDepartementsUniversite/{idUniversite}")
	public ResponseEntity<Set<Departement>> listerDepartementsUniversite(@PathVariable("idUniversite") Integer idUniversite) {
		try {
			Set<Departement> departements = universiteService.retrieveDepartementsByUniversite(idUniversite);
			return new ResponseEntity<>(departements, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			log.error("University not found when listing departments: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} catch (IllegalArgumentException e) {
			log.error("Invalid argument when listing departments: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			log.error("Error listing departments by university: {}", e.getMessage());
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}


