import { MockCSVProcessor } from "./mockCsvProcessorClass";
import { vi } from 'vitest'

const MockWorker = vi.fn()

export const mockCsvProcessorData1 = new MockCSVProcessor(
  new MockWorker(),
  {name: 'test_file_1.csv'},
  () => {},
  () => {},
  () => {}
)
mockCsvProcessorData1.stats = {
  "col_1": {
      "dataType": "string",
      "emptyValuesCount": 0,
      "totalRecords": 10,
      "topStrings": ["a", "b", "c"],
  },
  "col_2": {
      "dataType": "string",
      "emptyValuesCount": 10,
      "totalRecords": 10,
      "topStrings": ["a", "b", "c"],
  },
  "col_3": {
      "dataType": "number",
      "emptyValuesCount": 0,
      "totalRecords": 10,
      "mean": 100,
      "stdDev": 200
  },
  "col_4": {
      "dataType": "number",
      "emptyValuesCount": 0,
      "totalRecords": 10,
      "mean": 300,
      "stdDev": 400
  }
}

export const mockCsvProcessorData2 = new MockCSVProcessor(
  new MockWorker(),
  {name: 'test_file_2.csv'},
  () => {},
  () => {},
  () => {}
)
mockCsvProcessorData2.stats = {
  "col_A": {
      "dataType": "string",
      "emptyValuesCount": 0,
      "totalRecords": 10,
      "topStrings": ["a", "b", "c"],
  },
  "col_B": {
      "dataType": "number",
      "emptyValuesCount": 0,
      "totalRecords": 10,
      "mean": 10,
      "stdDev": 20
  },
}

export const mockResults = [{
  data: mockCsvProcessorData1,
  isLoading: false,
  isSuccess: true,
  isError: false,
  error: null,
}, {
  data: mockCsvProcessorData2,
  isLoading: false,
  isSuccess: true,
  isError: false,
  error: null,
}]