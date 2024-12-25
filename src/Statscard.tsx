import styles from "./styles/statscard.module.css";
import { CSVProcessor } from "./lib/utils/csvProcessor";
import { useState } from "react";
import { Button, ButtonVariant } from "./lib/components/button";

type StatscardProps = {
  data: CSVProcessor;
  onPrimaryBtnClick: () => void;
  onSecondaryBtnClick: () => void;
}

export function Statscard({data, onPrimaryBtnClick, onSecondaryBtnClick}: StatscardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const columnsData = Object.entries(data.stats);
  
  if (!isExpanded) {
    return (
      <div className={styles.statsbar}>
        <h3><span style={{fontWeight: 'normal'}}>File:</span> {data.file.name} <span style={{
          fontSize: '1rem',
          marginLeft: '0.5rem',
          color: 'var(--color-secondary-900)'
          }}>({columnsData[0][1].totalRecords} records)</span></h3>
        <Button 
          size="sm"
          onClick={() => setIsExpanded(true)}
          variant={ButtonVariant.PRIMARY}
          pill
          text="View Stats"
          style={{
            height: '25px',
            lineHeight: '25px',
            fontSize: '0.8rem',
          }}/>
      </div>
    )
  }
  return (
    <figure className={styles.statscard}>
      <figcaption>
        <div className={styles.statsHeading}>
          <h3><span style={{fontWeight: 'normal'}}>File:</span> {data.file.name} <span style={{
          fontSize: '1rem',
          marginLeft: '0.5rem',
          color: 'var(--color-white)'
          }}>({columnsData[0][1].totalRecords} records)</span></h3>
          <Button
            size="sm"
            onClick={() => setIsExpanded(false)}
            variant={ButtonVariant.PRIMARY}
            pill
            text="Minimize"
            style={{
              height: '25px',
              lineHeight: '25px',
              fontSize: '0.8rem',
            }}
          />
        </div>
        <table className={styles.table}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th>Column Name</th>
              <th>Data Type</th>
              <th>Top 5 Strings</th>
              <th>No. of Empty Values</th>
              <th>Mean</th>
              <th>Standard Deviation</th>
            </tr>
          </thead>
          <tbody>
            {columnsData.map(([columnName, columnStats]) => (
              <tr key={columnName}>
                <td>{columnName}</td>
                <td>{columnStats.dataType}</td>
                {columnStats.dataType === 'string' ? (
                  <td>{columnStats.topStrings.map((string, index) => 
                    <span key={string}>{string}{index < columnStats.topStrings.length - 1 ? ', ' : ''} </span>)}
                  </td>
                ):(
                  <td>N/A</td>
                )
                }
                <td>{columnStats.emptyValuesCount}</td>
                {columnStats.dataType === 'number' ? (
                  <>
                    <td>{columnStats.mean }</td>
                      <td>{columnStats.stdDev }</td>
                  </>
                ) : <>
                <td>N/A</td>
                <td>N/A</td>
              </>}
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
      <div className={styles.btnContainer}>
        <Button
          size="sm"
          onClick={onPrimaryBtnClick}
          variant={ButtonVariant.PRIMARY}
          pill
          text="View Chart"
        />
        <Button
          size="sm"
          onClick={onSecondaryBtnClick}
          variant={ButtonVariant.OUTLINE}
          pill
          text="Delete"
          style={{
            borderColor: 'var(--color-danger)',
            color: 'var(--color-danger)',
          }}
        />
      </div>
    </figure>
    );
}