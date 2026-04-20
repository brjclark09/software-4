import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  email = '';
  password = '';
  repeatPassword = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userState: UserStateService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.authService.register({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.userState.setUser(user);
        this.router.navigate(['/']);
      },
      error: () => this.errorMessage = 'Registration failed. Please try again.'
    });
  }
}
