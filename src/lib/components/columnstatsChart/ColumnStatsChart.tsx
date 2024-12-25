import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ErrorBar, Tooltip } from 'recharts';
import { type ColumnStats } from '../../../types';
import styles from './ColumnStatsChart.module.css';
import { Button, ButtonVariant } from '../button';
import { useResponsiveScreen } from '../../hooks/useResponsiveScreen';

interface ColumnStatsChartProps {
  columnStats: Record<string, ColumnStats>;
  onClose: () => void;
}

export function ColumnStatsChart({ columnStats, onClose }: ColumnStatsChartProps) {
  const chartData = Object.entries(columnStats).filter( entry => entry[1].dataType === 'number')
    .map(([columnName, stats]) => ({
      name: columnName,
      mean: stats.dataType === 'number' ? stats.mean : null,
      standardDeviation: stats.dataType === 'number' ? stats.stdDev : null
    }));
  const width = useResponsiveScreen();
  const isTablet = width > 768 && width < 1280;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Mean and Standard Deviation</h2>
        <Button pill variant={ButtonVariant.SECONDARY} size="sm" text="X" onClick={onClose}
        style={{
          height: '25px',
          lineHeight: '25px',
          minWidth: '25px',
          fontSize: '0.8rem',
          borderRadius: '50%',
          padding: 0,
        }} />
      </div>
      <BarChart
        width={isTablet ? 700 : 1400}
        height={isTablet ? 500 : 700}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload[0] && payload[0].value) {
              return (
                <div className={styles.customTooltip}>
                  <p>{`${label}`}</p>
                  <p>{`Mean: ${payload[0].value.toFixed(2)}`}</p>
                  <p>{`Std Dev: ${payload[0].payload.standardDeviation.toFixed(2)}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="mean"
          fill="#40a0a0"
          isAnimationActive={false}
        >
          <ErrorBar
            dataKey="standardDeviation"
            width={4}
            strokeWidth={2}
            stroke="#2a7070"
          />
        </Bar>
      </BarChart>
    </div>
  );
} 