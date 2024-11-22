import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef); //! this service for control open and send the data when close the dialog
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA); //! this is a container holds the data that send to dialaog

  fb = inject(FormBuilder);
  courseService = inject(CoursesService);

  //! initialization the course data when the component created
  constructor() {
    this.form.patchValue({
      title: this.data.course?.title,
      longDescription: this.data.course?.longDescription,
      category: this.data.course?.category,
      iconUrl: this.data.course?.iconUrl,
    });
  }

  //! FormBuilder
  form = this.fb.group({
    title: [''],
    longDescription: [''],
    category: [''],
    iconUrl: [''],
  });

  onClose() {
    this.dialogRef.close();
  }

  async onSave() {
    const formValue = this.form.value as Partial<Course>;
    if (this.data?.mode === 'update') {
      await this.SaveCourse(this.data.course!.id, formValue);
    } else if (this.data?.mode === 'create') {
      await this.createCourse(formValue);
    }
  }

  async SaveCourse(courseId: string, changes: Partial<Course>) {
    try {
      const updateCourse = await this.courseService.saveCourse(
        courseId,
        changes
      );
      this.dialogRef.close(updateCourse);
    } catch (error) {
      console.error(error);
      alert('Faild to save the course!');
    }
  }
  async createCourse(course: Partial<Course>) {
    try {
      const newCourse = await this.courseService.createCourse(course);
      this.dialogRef.close(newCourse);
      if (!newCourse) {
        return;
      }
    } catch (error) {
      console.error(error);
      alert('Faild to create an new course!');
    }
  }
}

//! Always write an open function dialaog in the same component
export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData
) {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();

  return firstValueFrom(close$);
}
