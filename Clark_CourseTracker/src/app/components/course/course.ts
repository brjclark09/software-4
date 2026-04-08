import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course-model';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-course',
  imports: [RouterLink],
  templateUrl: './course.html',
  styleUrl: './course.css',
})
export class CourseComponent {
  constructor(public courseService: CourseService) {}

  get courses(): Course[] {
    return this.courseService.getAllCourses();
  }

  deleteCourse(id: string): void {
    this.courseService.deleteCourse(id);
  }
}