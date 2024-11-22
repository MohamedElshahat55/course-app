import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { Course } from '../models/course.model';

export const courseResolver: ResolveFn<Course | null> = (route, state) => {
  const courseId = route.paramMap.get('course-id');

  if (!courseId) {
    return null;
  }

  const _coursesService = inject(CoursesService);
  return _coursesService.getCourseById(courseId);
};
