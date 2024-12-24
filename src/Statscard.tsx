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
  if (!isExpanded) {
    return (
      <div className={styles.statsbar}>
        <h3>File: {data.file.name}</h3>
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
          <h3>File: {data.file.name}</h3>
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
              <th>No. of Empty Values</th>
              <th>Mean</th>
              <th>Standard Deviation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.stats).map(([columnName, columnStats]) => (
              <tr key={columnName}>
                <td>{columnName}</td>
                <td>{columnStats.dataType}</td>
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
        {/* <Button
          size="sm"
          onClick={onSecondaryBtnClick}
          variant={ButtonVariant.SECONDARY}
          pill
          text="Delete"
        /> */}
      </div>
    </figure>
    );
}