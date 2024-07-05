import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';
import { AuthService } from '@core/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private API_URL = '/api';

  private authService = inject(AuthService);

  private localStorageService = inject(LocalStorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.localStorageService.getItem('access_token');

    if (!req.url.includes(this.API_URL)) {
      return next.handle(req);
    }

    if (accessToken) {
      req = this.addAccessToken(req, accessToken);

      return next.handle(req);
    }

    return next.handle(req).pipe<any>(
      catchError(error => {
        // Check if the error is due to an expired access token
        if (error.status === 401 && accessToken) {
          return this.handleTokenExpired(req, next);
        }

        return throwError(() => new Error(error));
      })
    );
  }

  private addAccessToken(req: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${JSON.parse(accessToken)}`
      }
    });
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Call the refresh token endpoint to get a new access token
    return this.authService.refreshAccessToken()
      .pipe(
        switchMap(data => {
          // Retry the original request with the new access token
          return next.handle(this.addAccessToken(request, data.access_token));
        }),
        catchError(error => {
          // Handle refresh token error (e.g., redirect to login page)
          console.error('Error handling expired access token:', error);
          return throwError(() => new Error(error));
        })
      );
  }

}
