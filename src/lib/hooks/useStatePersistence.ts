import { useEffect } from 'react';
import { DeserializedState } from '../../types';
import { CSVProcessor } from '../utils/csvProcessor';
import { UseQueryResult } from '@tanstack/react-query';

type UseStatePersistenceProps = {
  files: File[];
  results: UseQueryResult<CSVProcessor, Error>[];
}

export function useStatePersistence({ files, results }: UseStatePersistenceProps) {

  useEffect(() => {
    function handleBeforeUnload() {
      if (files.length === 0) return;
      const deserializedState: DeserializedState = {
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        })),
        processors: results
          .filter(result => result.isSuccess && result.data)
          .map(result => result.data!.serialize())
      };
      localStorage.setItem('csvState', JSON.stringify(deserializedState));
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [files, results])
}