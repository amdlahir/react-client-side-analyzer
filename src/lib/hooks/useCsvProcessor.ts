import { CSVProcessor, SerializedCSVProcessor } from "../utils/csvProcessor";
import type { CsvWorker } from "../../App";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { DeserializedState } from "../../types";
import { useIsMounted } from "./useIsMounted";

export function useCsvProcessor(
  csvWorker: CsvWorker,
): [UseQueryResult<CSVProcessor, Error>[], File[],React.Dispatch<React.SetStateAction<File[]>>] {

  const isMounted = useIsMounted(); 
  const savedState = !isMounted ? localStorage.getItem('csvState') : undefined; // This is not ideal, figure out async approach to get from localStorage
  const deserializedState: DeserializedState = savedState ? JSON.parse(savedState) : undefined;
  const [files, setFiles] = useState<File[]>(() =>
    deserializedState?.processors.map(processor => processor.file) ?? []
  );

  async function processNewFile(file: File) {
    const processor = new CSVProcessor(
      new csvWorker(),
      file,
      (data) => {
        console.log(data);
      },
      (data) => {
        console.log(data); // TODO: can be used to enhance the UI with progress bar
      },
      (error) => {
        console.log(error);
      }
    );
    await processor.processFile();
    return processor;
  }

  async function hydrateSerialized(serialized: SerializedCSVProcessor) {
    const processor = CSVProcessor.deserialize(serialized, serialized.file, new csvWorker());
    return Promise.resolve(processor);
  }

  return [
    useQueries({
      queries: deserializedState ? deserializedState.processors.map((serialized) => ({
        queryKey: ['csv-process', serialized.file.name],
        queryFn: () => hydrateSerialized(serialized),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5, // 5 minutes
      })) : files.map((file) => ({
        queryKey: ['csv-process', file.name],
        queryFn: () => processNewFile(file),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5, // 5 minutes
      })),
    }),
    files,
    setFiles
  ];
}