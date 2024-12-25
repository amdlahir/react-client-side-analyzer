import { ColumnsMetadata } from "../../types";

export type Status = 'pending' | 'processing' | 'complete' | 'cancelled' | 'error';

export class CSVProcessor {
  private id: string
  private _status: Status = 'pending';
  private worker: Worker | undefined;
  private _file: File;
  private onComplete: ((data: ColumnsMetadata) => void) | undefined;
  private onProgress: ((data: ColumnsMetadata) => void) | undefined;
  private onError: ((error: string) => void) | undefined;
  private _error: string | undefined;
  private _stats: ColumnsMetadata = {};
  constructor(worker: Worker, file: File,onComplete: (data: ColumnsMetadata) => void, onProgress: (data: ColumnsMetadata) => void, onError: (error: string) => void) {
    this.id = crypto.randomUUID();
    this._file = file;
    this.worker = worker;
    this.onComplete = onComplete;
    this.onProgress = onProgress;
    this.onError = onError;
    this.setupWorkerHandlers();
  }

  get processorId(): string {
    return this.id;
  }

  get file(): File {
    return this._file;
  }

  get error(): string | undefined {
    return this._error;
  }

  get stats(): ColumnsMetadata {
    return this._stats;
  }

  get status(): Status {
    return this._status;
  }

  setupWorkerHandlers() {
    if (!this.worker) {
      throw new Error('Worker is not initialized');
    }
    this.worker.onmessage = (e) => {
      const { type, data, error } = e.data; // TODO: strict typing
      
      switch (type) {
        case 'complete':
          this.onComplete?.(data);
          this._stats = data;
          this._status = 'complete';
          this.worker = undefined;
          break;
        case 'progress':
          this.onProgress?.(data);
          break;
        case 'error':
          this.onError?.(error);
          this._error = error;
          this._status = 'error';
          this.worker = undefined;
          break;
      }
    };
  }

  processFile(): Promise<ColumnsMetadata | Error> {
    return new Promise((resolve, reject) => {
      if (!(this.file instanceof File)) {
        reject(new Error('Input must be a File object'));
        return;
      }
      if (!this.worker) {
        reject(new Error('Worker is not initialized'));
        return;
      }

      this.onComplete = (data) => {
        resolve(data);
        this.onComplete = undefined;
      };
      
      this.onError = (error) => {
        reject(new Error(error));
        this.onError = undefined;
      };
      
      this.worker.postMessage(this.file);
    });
  }

  terminate() {
    if (!this.worker) {
      throw new Error('Worker is not initialized');
    }
    this.worker.terminate();
    this.worker = undefined;
  }
}