import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-course-create',
  imports: [FormsModule],
  templateUrl: './course-create.html',
  styleUrl: './course-create.css',
})
export class CourseCreateComponent {
  title = '';
  instructor = '';
  credits = 0;
  isCompleted = false;

  constructor(
    private router: Router,
    private courseService: CourseService
  ) {}

  onCreate(): void {
    this.courseService.addCourse({
      title: this.title,
      instructor: this.instructor,
      credits: this.credits,
      isCompleted: this.isCompleted
    });
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
