export interface Paging {
  page: number;
  pages: number;
  items: number;
}

export interface InstrumentDataView {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: {
    'active-tick': {
      symbol: string;
      'exchange': string;
      'defaultOrderSize': number
    },
    'simulation': {
      symbol: string;
      'exchange': string;
      'defaultOrderSize': number
    },
    'oanda': {
      symbol: string;
      'exchange': string;
      'defaultOrderSize': number
    }
  }
}

export interface InstrumentsDataPageView {
  paging: Paging
  data: InstrumentDataView[]
}
