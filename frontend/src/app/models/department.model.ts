import { University } from './university.model';

export interface Department {
  idDepart?: number;
  nomDepart: string;
  universite?: University;
  etudiants?: Etudiant[];
}

// Using interface reference to avoid circular dependency
interface Etudiant {
  idEtudiant?: number;
  prenomE: string;
  nomE: string;
  op?: string;
} 