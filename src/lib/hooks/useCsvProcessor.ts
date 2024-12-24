import { CSVProcessor } from "../utils/csvProcessor";
import type { CsvWorker } from "../../App";
import { useQueries } from "@tanstack/react-query";

export function useCsvProcessor(files: File[], csvWorker: CsvWorker) {
  return useQueries({
    queries: files.map((file) => ({
      queryKey: ['csv-process', file.name],
      queryFn: async () => {
        const processor = new CSVProcessor(
          new csvWorker(),
          file,
          (data) => {
            console.log(data); // TODO: remove
          },
          (data) => {
            console.log(data); // TODO: can be used to enhance the UI with progress bar
          },
          (error) => {
            console.log(error); // TODO: remove
          }
        );
        await processor.processFile();
        return processor;
      },
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5, // 5 minutes
    })),
  });
}