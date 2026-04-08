import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/course-model';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-course-details',
  imports: [FormsModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetailsComponent implements OnInit {
  editableCourse: Course | undefined;
  invalidId = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.courseService.getCourse(id);
      if (found) {
        this.editableCourse = { ...found };
      } else {
        this.invalidId = true;
      }
    }
  }

  onDone(): void {
    if (this.editableCourse) {
      this.courseService.updateCourse(this.editableCourse);
    }
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
