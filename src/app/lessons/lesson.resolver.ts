import { ResolveFn } from '@angular/router';
import { Lesson } from '../models/lesson.model';
import { LessonsService } from '../services/lessons.service';
import { inject } from '@angular/core';

export const lessonResolver: ResolveFn<Lesson[]> = (route, state) => {
  const courseId = route.paramMap.get('course-id');

  if (!courseId) {
    return [];
  }

  const _lessonService = inject(LessonsService);
  return _lessonService.loadLessons({ courseId });
};
