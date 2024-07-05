import { inject, Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';

const MAX_RETRY_COUNT = 5;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private ws: WebSocket;

  private messages$: Subject<any> = new Subject<any>();

  private wsURL: string = 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime';

  private connection$: Observer<MessageEvent>;

  private connectionSubscription: Subscription;

  private localStorageService = inject(LocalStorageService);

  constructor() {
    this.connect();
  }

  public reconnect() {
    this.disconnect();
    return this.connect();
  }

  private connect(attempt: number = 0) {
    let accessToken = this.localStorageService.getItem('access_token');

    if (!accessToken) {
      return;
    }

    this.connectionSubscription = this.createConnection(this.wsURL, JSON.parse(accessToken), attempt)
      .subscribe((response: MessageEvent) => {
        this.messages$.next(JSON.parse(response.data) as any);
      });
  }

  private createConnection(url: string, token: string, attempt: number): AnonymousSubject<MessageEvent> {
    this.ws = new WebSocket(`${url}?token=${token}`);
    const observable = new Observable((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });
    this.connection$ = {
      error: () => {
        this.connectionSubscription.unsubscribe();
        if (attempt < MAX_RETRY_COUNT) {
          this.connect(attempt + 1);
        }
      },
      complete: () => {
        this.connectionSubscription.unsubscribe();
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

    return new AnonymousSubject<MessageEvent>(this.connection$, observable);
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
