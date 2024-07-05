import { AuthService } from '@core/auth/services/auth.service';

export function initializeAuth(authService: AuthService) {
  return () => authService.login();
}
