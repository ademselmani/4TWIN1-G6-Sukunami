import { Department } from './department.model';

export interface Etudiant {
  idEtudiant?: number;
  prenomE: string;
  nomE: string;
  op?: string;
  departement?: Department;
} 