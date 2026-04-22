import { Component, inject, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { SuccessSnackBar } from '../success-snack-bar/success-snack-bar';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  @ViewChild('registerNgForm') registerNgForm!: NgForm;
  private _snackBar = inject(MatSnackBar);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  public registerForm: FormGroup;
  public errorMessages: string = '';

  constructor() {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public get controls() {
    return this.registerForm.controls;
  }

  private openSnackBar(): void {
    this._snackBar.openFromComponent(SuccessSnackBar, {
      duration: 3000,
      verticalPosition: 'top',
      data: {
        message: 'Registration successful!',
      },
    });
  }

  public register(): void {
    if (this.registerForm.invalid) {
      console.log('invalid form');
      return;
    }

    this.registerForm.disable();

    this._authService.register(this.registerForm.value).subscribe({
      next: (resp) => {
        this.openSnackBar();
        this._router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.registerForm.enable();

        console.log('err:', err);

        this.registerNgForm.resetForm();

        this.errorMessages = err.error;
      },
    });
  }
}