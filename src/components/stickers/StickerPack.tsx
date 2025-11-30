'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Sticker {
  id: string;
  url: string;
  name: string;
}

interface StickerPackProps {
  pack: {
    id: string;
    name: string;
    stickers: Sticker[];
  };
  onSelectSticker: (sticker: Sticker) => void;
}

export default function StickerPack({ pack, onSelectSticker }: StickerPackProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">{pack.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {pack.stickers.map(sticker => (
            <Button
              key={sticker.id}
              variant="ghost"
              className="p-2 h-auto"
              onClick={() => onSelectSticker(sticker)}
            >
              <img src={sticker.url} alt={sticker.name} className="w-12 h-12" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}