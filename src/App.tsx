import styles from './styles/app.module.css'
import { FileSelect } from './lib/components/fileSelect/fileSelect'
import csvWorker from './lib/workers/csvWorker.ts?worker'
import React, { useState } from 'react';
import { useCsvProcessor } from './lib/hooks/useCsvProcessor';
import { Statscard } from './Statscard';
import { CSVProcessor } from './lib/utils/csvProcessor';
import { ColumnStatsChart } from './lib/components/columnstatsChart/ColumnStatsChart';
import { Button, ButtonVariant } from './lib/components/button';
import { useStatePersistence } from './lib/hooks/useStatePersistence';
import { LoadingSpinner } from './lib/components/loadingSpinner/LoadingSpinner';
export type CsvWorker = typeof csvWorker;

function App() {
  const [selectedFile, setSelectedFile] = useState<CSVProcessor | undefined>();
  const [results, files, setFiles] = useCsvProcessor(csvWorker);
  useStatePersistence({ files, results });

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

  function handleDeleteFile(file: File) {
    setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name));
  }

  function handleClearAll() {
    setFiles([]);
    localStorage.removeItem('csvState');
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
              {isLoading ? (
                <div>
                  <LoadingSpinner size="lg" />
                  <p>Please wait while we process your files...</p>
                </div>
              ) : (
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
                  onSecondaryBtnClick={() => handleDeleteFile(fileData.file)}
                />
              )
            ))}
            {data && data.length > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'end', marginTop: '3rem', width: '100%' }}>
                <Button pill 
                  variant={ButtonVariant.SECONDARY}
                  size="md"
                  text="Clear All"
                  onClick={handleClearAll} />
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </React.Fragment>
  )
}

export default App
