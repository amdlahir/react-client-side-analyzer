import { csvParse } from 'd3-dsv';
import type { ColumnsMetadata, ColumnStats, DataType } from "../../types";
import * as mathjs from 'mathjs';


function determineDataType(value: string): DataType {
  if (!value || value.trim() === '') {
    throw new Error('Unable to determine data type - missing value')
  }

  const trimmedValue = value.trim();
  const numberValue = Number(trimmedValue);
  
  if (!isNaN(numberValue) && trimmedValue !== '') {
    return 'number';
  }

  return 'string';
}

function hasEmptyValues(rowData: Record<string, string>): boolean {
  return Object.values(rowData).some(value => value.trim() === '')
}

export function analyzeData(data: ReturnType<typeof csvParse<string>>): ColumnsMetadata {
  const rowWithNoEmptyValues = data.find(row => hasEmptyValues(row) === false);
  if (!rowWithNoEmptyValues) {
    throw new Error('Unable to determine data types')
  }

  const stats: Record<string, ColumnStats> = {};
  const columns = Object.keys(data[0]);

  columns.forEach(column => {
    let emptyValuesCount = 0;
    const values: (number | string)[] = [];
    data.forEach(row => {
      const columnStringValue = row[column].trim();
      if (columnStringValue === '') {
        emptyValuesCount++;
        return;
      }
      try {
        values.push(determineDataType(columnStringValue) === 'number' ? +columnStringValue : columnStringValue);
      } catch (error) {
        throw new Error(`Unable to determine data type for column ${column} - ${error}`);
      }
    });
    const dataType = determineDataType(rowWithNoEmptyValues[column]);
    try {
        if (dataType === 'number') {
          stats[column] = {
            dataType,
          emptyValuesCount,
          mean: mathjs.mean(values as number[]),
          stdDev: mathjs.std(values as number[]) as unknown as number,
        }
      } else {
        stats[column] = {
          dataType,
          emptyValuesCount,
        }
      }
    } catch (error) {
      throw new Error(`Unable to calculate mean and stdDev for column ${column} - ${error}`);
    }
  })
  return stats
}
