import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RemoveExif = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedImageBlob, setProcessedImageBlob] = useState<Blob | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const removeExifMetadata = async () => {
    if (!imageFile) return;

    // Process the image to remove EXIF metadata
    const blob = await processImage(imageFile);
    const processedImageUrl = URL.createObjectURL(blob);

    setProcessedImageBlob(blob);
    setProcessedImageUrl(processedImageUrl);
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

  const downloadImage = () => {
    if (!processedImageBlob) return;

    const url = URL.createObjectURL(processedImageBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed_image.jpg';
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
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {imageFile && (
            <div className="mt-4">
              <Button onClick={removeExifMetadata}>Remove EXIF Metadata</Button>
            </div>
          )}
          {processedImageUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Processed Image:</h3>
              <img src={processedImageUrl} alt="Processed" className="mt-2 max-w-full h-auto" />
              <Button onClick={downloadImage} className="mt-2">Download</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoveExif;