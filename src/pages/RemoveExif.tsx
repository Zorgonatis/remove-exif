import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JSZip from 'jszip';

const RemoveExif = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<Map<string, Blob>>(new Map());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(Array.from(event.target.files));
    }
  };

  const removeExifMetadata = async () => {
    const processedImagesMap = new Map<string, Blob>();

    for (const file of imageFiles) {
      const blob = await processImage(file);
      processedImagesMap.set(file.name, blob);
    }

    setProcessedImages(processedImagesMap);
  };

  const processImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to process image'));
              }
            }, 'image/jpeg');
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const downloadImage = (fileName: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '_processed.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = async () => {
    const zip = new JSZip();

    for (const [fileName, blob] of processedImages) {
      const url = URL.createObjectURL(blob);
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      zip.file(fileName.replace(/\.[^/.]+$/, '') + '_processed.jpg', arrayBuffer);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Remove EXIF Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
          {imageFiles.length > 0 && (
            <div className="mt-4">
              <Button onClick={removeExifMetadata}>Remove EXIF Metadata</Button>
            </div>
          )}
          {processedImages.size > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(processedImages).map(([fileName, blob]) => {
                const imageUrl = URL.createObjectURL(blob);
                return (
                  <div key={fileName} className="text-center">
                    <img src={imageUrl} alt={fileName} className="mt-2 max-w-full h-auto" />
                    <Button onClick={() => downloadImage(fileName, blob)} className="mt-2">Download</Button>
                  </div>
                );
              })}
            </div>
          )}
          {processedImages.size > 0 && (
            <div className="mt-4 text-center">
              <Button onClick={downloadAllImages}>Download All</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveExif;