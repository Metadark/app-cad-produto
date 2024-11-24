import { Observable } from '@nativescript/core';
import { navigate } from '../../utils/navigation';

export class LoginViewModel extends Observable {
  email: string = '';
  password: string = '';

  constructor() {
    super();
  }

  onLogin() {
    // TODO: Implement actual authentication
    if (this.email && this.password) {
      navigate('pages/dashboard/dashboard-page');
    }
  }

  onForgotPassword() {
    // TODO: Implement password recovery
    console.log('Forgot password clicked');
  }
}