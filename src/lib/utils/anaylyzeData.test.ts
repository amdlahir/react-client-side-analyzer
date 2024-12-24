import { analyzeData } from './analyzeData';
import { csvParse } from 'd3-dsv';

describe('analyzeData', () => {
  it('should correctly analyze numeric data', () => {
    const csvString = `value,other
1,a
2,b
3,c`;
    const data = csvParse(csvString);
    const result = analyzeData(data);

    expect(result.value).toEqual({
      dataType: 'number',
      emptyValuesCount: 0,
      mean: 2,
      stdDev: 1
    });
  });

  it('should correctly analyze string data', () => {
    const csvString = `text
a
b
c`;
    const data = csvParse(csvString);
    const result = analyzeData(data);

    expect(result.text).toEqual({
      dataType: 'string',
      emptyValuesCount: 0,
    });
  });

  it('should count empty values', () => {
    const csvString = `value
1

3
`;
    const data = csvParse(csvString);
    const result = analyzeData(data);

    expect(result.value.emptyValuesCount).toBe(1);
  });

  it('should throw error if all rows have empty values', () => {
    const csvString = `value
    
    
`;
    const data = csvParse(csvString);
    
    expect(() => analyzeData(data)).toThrow('Unable to determine data types');
  });

  it('should handle mixed numeric and string data', () => {
    const csvString = `mixed,pure_num
a,1
2,2
3,3`;
    const data = csvParse(csvString);
    const result = analyzeData(data);

    expect(result.mixed).toEqual({
      dataType: 'string',
      emptyValuesCount: 0,
    });

    expect(result.pure_num).toEqual({
      dataType: 'number',
      emptyValuesCount: 0,
      mean: 2,
      stdDev: 1
    });
  });
});
