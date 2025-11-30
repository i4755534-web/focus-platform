'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Upload, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ photos, onPhotosChange, maxPhotos = 6 }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        // In a real app, you would upload to a server
        // For demo, we'll create a data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              onPhotosChange([...photos, ...newPhotos].slice(0, maxPhotos));
              setUploading(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [moved] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, moved);
    onPhotosChange(newPhotos);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Фото профиля</h3>
            <Badge variant="outline">{photos.length}/{maxPhotos}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <Avatar className="w-full h-24 aspect-square">
                  <AvatarImage src={photo} alt={`Фото ${index + 1}`} />
                  <AvatarFallback>Фото {index + 1}</AvatarFallback>
                </Avatar>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
                {index > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    onClick={() => movePhoto(index, index - 1)}
                  >
                    ↑
                  </Button>
                )}
                {index < photos.length - 1 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute -bottom-2 right-1/2 transform translate-x-1/2 w-8 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    onClick={() => movePhoto(index, index + 1)}
                  >
                    ↓
                  </Button>
                )}
              </div>
            ))}

            {photos.length < maxPhotos && (
              <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex flex-col gap-1"
                >
                  {uploading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Добавить</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || photos.length >= maxPhotos}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Загрузка...' : 'Загрузить фото'}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Вы можете загрузить до {maxPhotos} фото. Первое фото будет основным.
            Поддерживаемые форматы: JPG, PNG, GIF.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}