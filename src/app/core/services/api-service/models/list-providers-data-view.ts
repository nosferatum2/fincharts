export type ProviderType = 'active-tick' | 'alpaca' | 'cryptoquote' | 'dxfeed' | 'oanda' | 'simulation';

export interface ListProvidersDataView {
  data: ProviderType[]
}
