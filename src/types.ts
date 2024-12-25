export type DataType = 'string' | 'number'

export type ColumnStats = {
  dataType: 'string',
  emptyValuesCount: number,
  totalRecords: number,
  topStrings: string[],
} | {
  dataType: 'number',
  emptyValuesCount: number,
  mean: number,
  stdDev: number,
  totalRecords: number,
}

export type ColumnsMetadata = Record<string, ColumnStats>

export type Analysis = {
  fileName: string;
  columns: ColumnsMetadata;
}