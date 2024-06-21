import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // private apiService = inject(ApiService);

  private tokenURL = '/identity/realms/fintatech/protocol/openid-connect/token';

  // private reqBody =
  // 'grant_type=password&client_id=app-cli&username=r_test@fintatech.com&password=kisfiz-vUnvy9-sopnyv';

  private authToken: string;

  constructor() {
    // TODO: move access_token to the auth service
    // this.apiService.doPostRequest<AccessDataView>(this.tokenURL, this.reqBody)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(data => this.authToken = data.access_token);
    console.log('authToken', this.authToken);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(this.tokenURL)) {
      return next.handle(req);
    }

    if (this.authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
    }

    return next.handle(req);
  }

}
