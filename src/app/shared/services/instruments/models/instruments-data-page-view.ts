import { ProviderType } from '@shared/services/instruments/models/providers-data-view';

export type ProviderDataView = {
  [key in ProviderType]: ProviderMappingItem;
};

export interface Paging {
  page: number;
  pages: number;
  items: number;
}

export interface ProviderMappingItem {
  symbol: string;
  exchange: string;
  defaultOrderSize: number
}

export interface InstrumentDataView {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: ProviderDataView
}

export interface InstrumentsDataPageView {
  paging: Paging
  data: InstrumentDataView[]
}
