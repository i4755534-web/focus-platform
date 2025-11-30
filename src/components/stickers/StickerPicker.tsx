'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface Sticker {
  id: string;
  url: string;
  name: string;
  category: string;
}

interface StickerPickerProps {
  onSelectSticker: (sticker: Sticker) => void;
  stickers: Sticker[];
}

export default function StickerPicker({ onSelectSticker, stickers }: StickerPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(stickers.map(s => s.category)))];

  const filteredStickers = stickers.filter(sticker => {
    const matchesSearch = sticker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sticker.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <Input
        type="text"
        placeholder="Поиск стикеров..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category === 'all' ? 'Все' : category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={selectedCategory} className="mt-4">
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {filteredStickers.map(sticker => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}