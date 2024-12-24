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
    setFiles(prevFiles => [...prevFiles, ...files]);
  }

  function handleCloseChart() {
    setSelectedFile(undefined);
  }

  return (
    <React.Fragment>
      {selectedFile ?  (
        <React.Fragment>
          <div className={styles.screenOverlay} />
          <div className={styles.chartContainer}>
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
              {isLoading ? <p className="text-white">Please wait while we process your files...</p> : (
                <p className="text-white">
                  Add csv file
                  <br />
                  <span className="text-[0.8rem] text-secondary-300">
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
