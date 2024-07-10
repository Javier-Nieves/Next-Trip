'use client';

import {
  MultiImageDropzone,
  type FileState,
} from '@/app/_components/MultiImageDropzone';

import { useState } from 'react';
import { useEdgeStore } from '../_lib/edgestore';

export function MultiImageDropzoneUsage({
  setUploadedImages,
  setIsLoading,
  maxFiles,
}) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div>
      <MultiImageDropzone
        value={fileStates}
        dropzoneOptions={{
          maxSize: 2097152,
          maxFiles,
        }}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                setIsLoading(true);
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, 'COMPLETE');
                    }
                  },
                });
                setUploadedImages((cur) => [...cur, res.url]);
              } catch (err) {
                updateFileProgress(addedFileState.key, 'ERROR');
              } finally {
                setIsLoading(false);
              }
            }),
          );
        }}
      />
    </div>
  );
}
