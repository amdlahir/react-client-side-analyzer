import { Status } from "../../lib/utils/csvProcessor";
import { ColumnsMetadata } from "../../types";

export class MockCSVProcessor {
  public id: string
  public status: Status = 'pending';
  public worker: Worker | undefined;
  public file: {name: string};
  public onComplete: ((data: ColumnsMetadata) => void) | undefined;
  public onProgress: ((data: ColumnsMetadata) => void) | undefined;
  public onError: ((error: string) => void) | undefined;
  public error: string | undefined;
  public stats: ColumnsMetadata = {};
  constructor(worker: Worker, file: {name: string}, onComplete: (data: ColumnsMetadata) => void, onProgress: (data: ColumnsMetadata) => void, onError: (error: string) => void) {
    this.id = crypto.randomUUID();
    this.file = file;
    this.worker = worker;
    this.onComplete = onComplete;
    this.onProgress = onProgress;
    this.onError = onError;
  }
}