import { Injectable } from '@angular/core';
import { Course } from '../models/course-model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  
  private courses: Course[] = [
    { id: '1', title: 'Introduction to Computer Science', instructor: 'Dr. Alice Morgan', credits: 3, isCompleted: true },
    { id: '2', title: 'Data Structures & Algorithms', instructor: 'Prof. James Carter', credits: 4, isCompleted: false },
    { id: '3', title: 'Web Development Fundamentals', instructor: 'Dr. Sarah Lee', credits: 3, isCompleted: false },
    { id: '4', title: 'Database Management Systems', instructor: 'Prof. David Kim', credits: 3, isCompleted: true },
  ];

  getAllCourses(): Course[] {
    return this.courses;
  }

  getCourse(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  addCourse(course: Omit<Course, 'id'>): void {
    (course as Course).id = this.courses.length + 1 + '';
    this.courses.push(course as Course);
  }

  updateCourse(updatedCourse: Course): void {
    const index = this.courses.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
      this.courses.splice(index, 1, updatedCourse);
    }
  }

  deleteCourse(id: string): void {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
    }
  }
}
