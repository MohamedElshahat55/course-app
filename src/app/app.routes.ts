import { authGuard } from './guards/auth.guard';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LessonsComponent } from './lessons/lessons.component';
import { CourseComponent } from './course/course.component';
import { courseResolver } from './course/course.resolver';
import { lessonResolver } from './lessons/lesson.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [authGuard],
  },
  {
    path: 'course/:course-id',
    component: CourseComponent,
    resolve: {
      course: courseResolver,
      lessons: lessonResolver,
    },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'lessons',
    component: LessonsComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
