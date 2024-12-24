import { csvParse } from 'd3-dsv';
import { analyzeData } from '../utils/analyzeData';

self.onmessage = function(e) {
  const file: File = e.data;
  if (!file) {
    self.postMessage({
      type: 'error',
      error: 'No file provided'
    })
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    if (!e.target) {
      self.postMessage({
        type: 'error',
        error: 'Unexpected error - no target while reading file'
      })
      return;
    }
    const data = csvParse(e.target.result as string)
    const analysis = analyzeData(data)
    self.postMessage({
      type: 'complete',
      data: analysis
    })
  }
  reader.readAsText(file);
};
