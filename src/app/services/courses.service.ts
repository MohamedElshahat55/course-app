import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';
import { skipLoading } from '../loading/skip-loading.component';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  env = environment;

  http = inject(HttpClient);

  // RETRIVE ALL COURCES
  async loadCourses(): Promise<Course[]> {
    const courses$ = this.http.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`
    );
    const response = await firstValueFrom(courses$);
    return response.courses;
  }

  //CREATE A NEW COURSE
  async createCourse(course: Partial<Course>): Promise<Course> {
    const course$ = this.http.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );
    return firstValueFrom(course$);
  }

  async getCourseById(courseId: string): Promise<Course> {
    const course$ = this.http.get<Course>(
      `${this.env.apiRoot}/courses/${courseId}`
    );
    return firstValueFrom(course$);
  }

  // UPDATE THE CONTENT OF COURSE
  async saveCourse(
    courseId: string,
    changes: Partial<Course>
  ): Promise<Course> {
    const course$ = this.http.put<Course>(
      `${this.env.apiRoot}/courses/${courseId}`,
      changes
    );
    return firstValueFrom(course$);
  }

  // DELETE THE CONTENT OF COURSE
  async deleteCourse(courseId: string): Promise<Course> {
    const delete$ = this.http.delete<Course>(
      `${this.env.apiRoot}/courses/${courseId}`
    );
    return firstValueFrom(delete$);
  }
}

// ,
//       {
//         context: new HttpContext().set(skipLoading, true),
//       }
