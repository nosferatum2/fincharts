export type ProviderType = 'active-tick' | 'alpaca' | 'cryptoquote' | 'dxfeed' | 'oanda' | 'simulation';

export interface ProvidersDataView {
  data: ProviderType[]
}
