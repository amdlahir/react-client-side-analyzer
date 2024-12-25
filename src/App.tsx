import styles from './styles/app.module.css'
import { FileSelect } from './lib/components/fileSelect/fileSelect'
import csvWorker from './lib/workers/csvWorker.ts?worker'
import React, { useState } from 'react';
import { useCsvProcessor } from './lib/hooks/useCsvProcessor';
import { Statscard } from './Statscard';
import { CSVProcessor } from './lib/utils/csvProcessor';
import { ColumnStatsChart } from './lib/components/columnstatsChart/ColumnStatsChart';
import { Button, ButtonVariant } from './lib/components/button';
export type CsvWorker = typeof csvWorker;

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const results = useCsvProcessor(files, csvWorker);
  const [selectedFile, setSelectedFile] = useState<CSVProcessor | undefined>(undefined);

  const isLoading = results.some(result => result.isLoading);
  const data = results
    .filter(result => result.isSuccess && result.data)
    .map(result => result.data);

  function handleFileChange(files: File[]) {
    setFiles(prevFiles => {
      const newFiles = files.filter(file => !prevFiles.some(existingFile => existingFile.name === file.name));
      return [...prevFiles, ...newFiles];
    });
  }

  function handleCloseChart() {
    setSelectedFile(undefined);
  }

  return (
    <React.Fragment>
      {selectedFile ?  (
        <React.Fragment>
          <div className={styles.screenOverlay} />
          <div className={styles.chartContainer} role="dialog">
            <ColumnStatsChart columnStats={selectedFile.stats} onClose={handleCloseChart} />
          </div>
        </React.Fragment>
      ) : null}
      <main className={styles.page}>
        <div className={styles.fileSelectContainer}>
          <FileSelect
            disabled={isLoading}
            onFilesSelected={handleFileChange}
            className={styles.fileSelect}>
            <FileSelect.Input
              accept=".csv,text/csv"
              multiple
            />
            <FileSelect.DropZone>
              {isLoading ? <p>Please wait while we process your files...</p> : (
                <p>
                  Add CSV files
                  <br />
                  <span>
                  (click or drag & drop files here)
                  </span>
                </p>
              )}
            </FileSelect.DropZone>
          </FileSelect>
          <section className={styles.statsContainer}>
            {data.map((fileData) => (
              fileData && (
                <Statscard 
                  key={fileData.processorId} 
                  data={fileData} 
                  onPrimaryBtnClick={() => setSelectedFile(fileData)}
                  onSecondaryBtnClick={() => setSelectedFile(fileData)}
                />
              )
            ))}
            {data && data.length > 0 ? (
              <div>
                <Button pill variant={ButtonVariant.SECONDARY} size="sm" text="Clear" onClick={() => setFiles([])} />
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </React.Fragment>
  )
}

export default App
