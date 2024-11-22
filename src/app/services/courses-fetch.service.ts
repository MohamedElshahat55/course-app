import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Course } from '../models/course.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesServiceWithFetch {
  env = environment;

  async loadCourses(): Promise<Course[]> {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();
    return payload.courses;
  }

  // http = inject(HttpClient);

  // async loadCourses(): Promise<Course[]> {
  //   const courses$ = this.http.get<GetCoursesResponse>(
  //     `${this.env.apiRoot}/courses`
  //   );
  //   const response = await firstValueFrom(courses$);
  //   return response.courses;
  // }
}
