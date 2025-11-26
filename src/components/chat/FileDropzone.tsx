'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileDropzone() {
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('Файлы:', acceptedFiles);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        alert(`Загружен файл: ${file.name}`);

        // Превью для изображений
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setPreview(url);
        }
      }
    },
  });

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer hover:bg-gray-50">
        <input {...getInputProps()} />
        <p>Перетащите файлы сюда или кликните для выбора</p>
      </div>
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="max-w-full h-auto rounded" />
        </div>
      )}
    </div>
  );
}