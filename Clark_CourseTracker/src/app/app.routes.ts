import { Routes } from '@angular/router';
import { CourseComponent } from './components/course/course';
import { CourseDetailsComponent } from './components/course-details/course-details';
import { CourseCreateComponent } from './components/course-create/course-create';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found';

export const routes: Routes = [
  { path: '', component: CourseComponent },
  { path: 'courses/create', component: CourseCreateComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: '**', component: PageNotFoundComponent }
];
