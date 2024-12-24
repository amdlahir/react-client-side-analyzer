import { CSVProcessor } from "../utils/csvProcessor";
import type { CsvWorker } from "../../App";
import { useQuery } from "@tanstack/react-query";

export function useCsvProcessor(files: File[], csvWorker: CsvWorker)  {
  const tag = files.map(file => file.name).join(', ');

  return useQuery({
    queryKey: [tag],
    queryFn: async () => {
      const processors = files.map(file => new CSVProcessor(
        new csvWorker(),
        file, 
        (data) => {
          console.log(data);
        }, 
        (data) => {
          console.log(data);
        }, 
        (error) => {
          console.log(error);
        }
      ));
      await Promise.allSettled(processors.map(processor => processor.processFile()));
      return processors;
    }
  })

}