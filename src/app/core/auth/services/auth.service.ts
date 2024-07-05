import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service/api.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { AccessDataView } from '@core/services/api-service/models/access-data-view';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';

const headers = new HttpHeaders()
  .set('Content-Type', 'application/x-www-form-urlencoded');

const params = new HttpParams()
  .set('grant_type', 'password')
  .set('client_id', 'app-cli')
  .set('username', 'r_test@fintatech.com')
  .set('password', 'kisfiz-vUnvy9-sopnyv');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenURL: string = '/identity/realms/fintatech/protocol/openid-connect/token';

  private apiService = inject(ApiService);

  private localStorageService = inject(LocalStorageService);

  login(): Observable<AccessDataView> {
    return this.apiService.doPostRequest<AccessDataView>(
      this.tokenURL,
      params.toString(),
      { headers, observe: 'body' }
    )
      .pipe(
        map(res => {
          this.setStorageData(res);

          return res;
        })
      );
  }

  refreshAccessToken(): Observable<AccessDataView> {
    // Call the refresh token endpoint to get a new access token
    return this.apiService.doPostRequest<AccessDataView>(
      this.tokenURL,
      params.toString(),
      { headers, observe: 'body' }
    ).pipe(
      map(res => {
        this.setStorageData(res);

        return res;
      }),
      catchError(error => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error refreshing access token:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  setStorageData(accessData: AccessDataView) {
    Object.entries(accessData).forEach(([key, value]) => {
      this.localStorageService.setItem(key, JSON.stringify(value));
    });
  }

  logout() {
    this.localStorageService.clear();
  }

}
