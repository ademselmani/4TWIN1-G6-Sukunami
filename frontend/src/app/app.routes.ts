import { Routes } from '@angular/router';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityDetailComponent } from './components/university/university-detail/university-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/universities', pathMatch: 'full' },
  { path: 'universities', component: UniversityListComponent },
  { path: 'universities/:id', component: UniversityDetailComponent },
];
