import { Routes } from '@angular/router';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityDetailComponent } from './components/university/university-detail/university-detail.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { DepartmentDetailComponent } from './components/department/department-detail/department-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/universities', pathMatch: 'full' },
  { path: 'universities', component: UniversityListComponent },
  { path: 'universities/:id', component: UniversityDetailComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'departments/:id', component: DepartmentDetailComponent },
  { path: 'upload', component: FileUploadComponent },
];
