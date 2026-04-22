import { Component, inject, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  @ViewChild('loginNgForm') loginNgForm!: NgForm;
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  public loginForm: FormGroup;
  public message: string = '';

  showAlert: boolean = false;

  get controls() {
    return this.loginForm.controls;
  }

  constructor() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  login(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.loginForm.disable();

    this.showAlert = false;

    this._authService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        this._router.navigate(['']);
      },
      error: (err) => {
        this.loginForm.enable();

        this.loginNgForm.resetForm();

        this.message = err.error;

        this.showAlert = true;
      },
    });
  }
}