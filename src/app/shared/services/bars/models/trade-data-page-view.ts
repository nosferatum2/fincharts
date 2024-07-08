/**
 * "t": This represents the timestamp of the data point.
 * The value "2024-07-08T09:05:00+00:00" indicates the date and time in ISO 8601 format.
 * "o": This stands for "open" and represents the opening price of the asset at the given timestamp.
 * "h": This stands for "high" and represents the highest price of the asset during the given timestamp.
 * "l": This stands for "low" and represents the lowest price of the asset during the given timestamp.
 * "c": This stands for "close" and represents the closing price of the asset at the given timestamp.
 * "v": This represents the volume traded during the given timestamp.
 */
export interface TradeDataView {
  t: Date,
  o: number,
  h: number,
  l: number,
  c: number,
  v: number
}

export interface TradeDataPageView {
  data: TradeDataView[]
}
