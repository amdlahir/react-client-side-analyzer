import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './App';
import { mockResults } from './test/mocks/processedCsvData';

const mocks = vi.hoisted(() => {
  return {
    mockUseQueriesHook: vi.fn(),
  };
});

vi.mock('@tanstack/react-query', () => ({
  useQueries: mocks.mockUseQueriesHook,
}))

describe('Application', () => {
  it('should render the file selector on initial render', () => {
    mocks.mockUseQueriesHook.mockReturnValue([])
    render(<App />);
    expect(screen.getByText(/Add csv file/i)).toBeInTheDocument();
  })

  it('shoud render multiple csv file stats cards', async () => {
    mocks.mockUseQueriesHook.mockReturnValue(mockResults)
    render(<App />)
    for (const result of mockResults) {
      expect(screen.getByText(`File: ${result.data.file.name}`)).toBeInTheDocument();
    }
    const viewStatsButtons = screen.getAllByText(/view stats/i)
    expect(viewStatsButtons.length).toBe(mockResults.length);
    //expand card 1
    await userEvent.click(viewStatsButtons[0])
    Object.keys(mockResults[0].data.stats).forEach(colName => {
      expect(screen.getByText(colName)).toBeInTheDocument();
    })
    expect(screen.getAllByText('string').length).toBe(2);
    expect(screen.getAllByText('number').length).toBe(2);
    expect(screen.getAllByText('0').length).toBe(3);
    expect(screen.getAllByText('100').length).toBe(1);
    expect(screen.getAllByText('200').length).toBe(1);
    expect(screen.getAllByText('300').length).toBe(1);
    expect(screen.getAllByText('400').length).toBe(1);
    //minimize card 1
    await userEvent.click(screen.getByText(/minimize/i))
    Object.keys(mockResults[0].data.stats).forEach(colName => {
      expect(screen.queryByText(colName)).not.toBeInTheDocument();
    })

    //expand card 2
    await userEvent.click(viewStatsButtons[1])
    Object.keys(mockResults[1].data.stats).forEach(colName => {
      expect(screen.getByText(colName)).toBeInTheDocument();
    })
    expect(screen.getAllByText('string').length).toBe(1);
    expect(screen.getAllByText('number').length).toBe(1);
    expect(screen.getAllByText('0').length).toBe(2);
    expect(screen.getAllByText('10').length).toBe(1);
    expect(screen.getAllByText('20').length).toBe(1);
    //minimize card 2
    await userEvent.click(screen.getByText(/minimize/i))
    Object.keys(mockResults[1].data.stats).forEach(colName => {
      expect(screen.queryByText(colName)).not.toBeInTheDocument();
    })
  })

  it('shoud render chart', async () => {
    mocks.mockUseQueriesHook.mockReturnValue(mockResults);
    render(<App />);
    const viewStatsButtons = screen.getAllByText(/view stats/i);
    await userEvent.click(viewStatsButtons[0]);
    await userEvent.click(screen.getByText(/view chart/i));
    expect(screen.getByText(/mean and standard deviation/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  })
})