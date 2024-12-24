import styles from './styles/app.module.css'
import { FileSelect } from './lib/components/fileSelect/fileSelect'
import csvWorker from './lib/workers/csvWorker.ts?worker'
import React, { useState } from 'react';
import { useCsvProcessor } from './lib/hooks/useCsvProcessor';
import { Statscard } from './Statscard';
import { CSVProcessor } from './lib/utils/csvProcessor';
import { ColumnStatsChart } from './lib/components/columnstatsChart/ColumnStatsChart';
export type CsvWorker = typeof csvWorker;

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const { data, isLoading, error } = useCsvProcessor(files, csvWorker);
  const [selectedFile, setSelectedFile] = useState<CSVProcessor | undefined>(undefined);

  function handleFileChange(files: File[]) {
    setFiles(files);
  }

  function handleCloseChart() {
    setSelectedFile(undefined);
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
              <p className="text-white">
                Add csv file
                <br />
                <span className="text-[0.8rem] text-secondary-300">
                  (click or drag & drop files here)
                </span>
              </p>
            </FileSelect.DropZone>
          </FileSelect>
          <section className={styles.statsContainer}>
            {data?.map((fileData) => (
              <Statscard 
                key={fileData.processorId} 
                data={fileData} 
                onPrimaryBtnClick={() => setSelectedFile(fileData)}
                onSecondaryBtnClick={() => setSelectedFile(fileData)}
              />
            ))}
          </section>
        </div>
      </main>
    </React.Fragment>
  )
}

export default App
