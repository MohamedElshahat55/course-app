import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  _fb = inject(FormBuilder);
  _messageService = inject(MessagesService);
  _authService = inject(AuthService);
  _router = inject(Router);

  form = this._fb.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this._messageService.showMessage(
          'Enter an email and password.',
          'error'
        );
        return;
      }
      await this._authService.login(email, password);
      await this._router.navigate(['/home']);
    } catch (err) {
      console.error(err);
      this._messageService.showMessage(
        'Login failed, please try again',
        'error'
      );
    }
  }
}
