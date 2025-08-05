import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileImporter({ onFileProcessed }) {
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => onFileProcessed(reader.result);
    reader.readAsText(acceptedFiles[0]);
  }, [onFileProcessed]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/octet-stream': ['.novx'] },
    maxFiles: 1
  });

  return (
    <div {...getRootProps()} className="p-8 border-2 border-dashed text-center">
      <input {...getInputProps()} />
      <p>Drag .novx file here or click to browse</p>
    </div>
  );
}