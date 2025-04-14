import { University } from './university.model';

export interface Department {
  idDepart?: number;
  nomDepart: string;
  etudiants?: any[]; // Using any[] to avoid circular dependency
  universite?: University;
}

// Using interface reference to avoid circular dependency
interface Etudiant {
  idEtudiant?: number;
  prenomE: string;
  nomE: string;
  op?: string;
} 