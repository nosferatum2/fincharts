import { inject, Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map, Observable, Observer, Subject, Subscription, switchMap } from 'rxjs';
import { ApiService } from '@core/services/api-service/api.service';
import { AccessDataView } from '@core/services/api-service/models/access-data-view';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpHeaders, HttpParams } from '@angular/common/http';

const headers = new HttpHeaders()
  .set('Content-Type', 'application/x-www-form-urlencoded');

const params = new HttpParams()
  .set('grant_type', 'password')
  .set('client_id', 'app-cli')
  .set('username', 'r_test@fintatech.com')
  .set('password', 'kisfiz-vUnvy9-sopnyv');

const MAX_RETRY_COUNT = 5;

@Injectable({ providedIn: 'root' })
export class WebsocketService {

  private ws: WebSocket;

  private messages$: Subject<any> = new Subject<any>();

  private tokenURL: string = '/identity/realms/fintatech/protocol/openid-connect/token';

  private wsURL: string = 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime';

  private connection$: AnonymousSubject<MessageEvent<any>>;

  private apiService = inject(ApiService);

  constructor() {
    this.connect();
  }

  public reconnect() {
    this.disconnect();
    return this.connect();
  }

  private connect(attempt: number = 0) {
    this.apiService.doPostRequest<AccessDataView>(
      this.tokenURL,
      params.toString(),
      { headers, observe: 'body' }
    )
      .pipe(
        switchMap(data => {
          return this.createConnection(this.wsURL, data.access_token, attempt);
        }),
        map((response: MessageEvent) => {
          this.messages$.next(JSON.parse(response.data) as any);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private createConnection(url: string, token: string, attempt: number): AnonymousSubject<MessageEvent> {
    this.ws = new WebSocket(`${url}?token=${token}`);
    const observable = new Observable((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });
    const observer = {
      error: () => {
        if (attempt < MAX_RETRY_COUNT) {
          this.connect(attempt + 1);
        }
      },
      complete: () => {
        if (attempt < MAX_RETRY_COUNT) {
          this.connect(attempt + 1);
        }
      },
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      },
    };

    this.connection$ = new AnonymousSubject<MessageEvent>(observer, observable);
    return this.connection$;
  }

  public disconnect(): any {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }

  public sendMessage(payload: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.connection$.next(payload);
    }
  }

  public getMessages(): Observable<any> {
    return this.messages$.asObservable();
  }

  public subscribe<T>(payloadType: any, handler: (payload: T) => void): Subscription {
    return this.messages$.subscribe(m => {
      if (m.payloadType == payloadType) {
        handler(m.payload);
      }
    });
  }

}
