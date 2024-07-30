import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  OutputRef,
  Signal
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { CurrencyOption } from '@pages/models/currency-options';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sub-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './sub-form.component.html',
  styleUrl: './sub-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubFormComponent {

  private selectedOption: CurrencyOption | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);

  protected subscriptionForm: FormGroup = this.formBuilder.group({
    symbolSub: ['', Validators.required]
  });

  filterOptions: InputSignal<CurrencyOption[]> = input.required<CurrencyOption[]>();

  inputChanged: OutputRef<string> = outputFromObservable<string>(this.subscriptionForm.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => prev.symbolSub === curr.symbolSub),
      map(({ symbolSub }) => {
        this.selectedOption = null;
        return symbolSub;
      }),
      takeUntilDestroyed()
    )
  );

  submitted: OutputEmitterRef<CurrencyOption> = output<CurrencyOption>();

  currencyOptions: Signal<CurrencyOption[]> = computed(() => this.filterOptions());

  public onSubmit() {
    if (this.subscriptionForm.valid && this.selectedOption) {
      this.submitted.emit(this.selectedOption);
    }
  }

  public selectOption(option: CurrencyOption) {
    this.selectedOption = option;
    this.currencyOptions().length = 0;

    this.subscriptionForm.controls['symbolSub'].patchValue(option.value, { emitEvent: false });
  }

}
