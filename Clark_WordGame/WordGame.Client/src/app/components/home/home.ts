import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private _authService = inject(AuthService);

  public isLoggedIn = this._authService.isLoggedIn;
  public userEmail = this._authService.userEmail;
}
