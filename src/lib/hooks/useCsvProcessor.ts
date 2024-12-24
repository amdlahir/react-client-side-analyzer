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
          console.log(data); // TODO: remove
        }, 
        (data) => {
          console.log(data); // TODO: can be used to enhance the UI with progress bar
        }, 
        (error) => {
          console.log(error); // TODO: remove
        }
      ));
      await Promise.allSettled(processors.map(processor => processor.processFile()));
      return processors;
    }
  })

}