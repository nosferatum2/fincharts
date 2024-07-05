import { ProviderType } from '@shared/services/instruments/models/providers-data-view';

export type ExchangeView = {
  [key in ProviderType]: string[];
};

export interface ExchangesDataView {
  data: ExchangeView
}
