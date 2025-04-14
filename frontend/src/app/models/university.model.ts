import { Department } from './department.model';

export interface University {
  idUniv?: number;
  nomUniv: string;
  imagePath?: string;
  description?: string;
  location?: string;
  departements?: Department[];
} 