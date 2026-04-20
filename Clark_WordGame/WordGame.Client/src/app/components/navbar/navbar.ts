import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserStateService } from '../../services/user-state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html'
})
export class Navbar {
  constructor(
    public userState: UserStateService,
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.userState.clearUser();
        this.router.navigate(['/']);
      },
      error: () => {
        this.userState.clearUser();
        this.router.navigate(['/']);
      }
    });
  }
}
