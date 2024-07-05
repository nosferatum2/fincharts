import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from '@core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {

  title = 'fintacharts';

  private localStorageService = inject(LocalStorageService);

  ngOnDestroy() {
    this.localStorageService.clear();
  }

}
