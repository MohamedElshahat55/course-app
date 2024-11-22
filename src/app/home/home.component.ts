import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { text } from 'body-parser';

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]); //?# Make a signal is private

  dialog = inject(MatDialog);

  beginnerCourses = computed(() => {
    return this.#courses().filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    return this.#courses().filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    effect(() => {
      console.log('beginner courses', this.beginnerCourses());
      console.log('advanced courses', this.advancedCourses());
    });

    this.loadCourses().then(() =>
      console.log('All Courses loaded', this.#courses())
    );
  }

  courseService = inject(CoursesService);
  messageService = inject(MessagesService);

  async loadCourses() {
    try {
      const courses = await this.courseService.loadCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.messageService.showMessage('Error loading courses!', 'error');
      console.error(error);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(deletedCourseId: string) {
    try {
      await this.courseService.deleteCourse(deletedCourseId);

      const courses = this.#courses();

      const newCourses = courses.filter(
        (course) => course.id !== deletedCourseId
      );

      this.#courses.set(newCourses);
    } catch (error) {
      console.error(error);
      alert('Error deleting Course.');
    }
  }

  async onCreateCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Add a new course',
    });

    if (!newCourse) {
      return;
    }

    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }
}
