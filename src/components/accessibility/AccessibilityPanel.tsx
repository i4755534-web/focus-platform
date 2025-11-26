'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@//components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Accessibility, Eye, Volume2, Type, Keyboard, Focus } from 'lucide-react';

export default function AccessibilityPanel() {
  const {
    accessibilityState,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    announce,
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (setting: keyof typeof accessibilityState.settings, value: boolean) => {
    switch (setting) {
      case 'highContrast':
        toggleHighContrast();
        break;
      case 'reducedMotion':
        toggleReducedMotion();
        break;
      case 'largeText':
        toggleLargeText();
        break;
      default:
        // For other settings, just announce the change
        announce(`${setting} ${value ? 'включен' : 'отключен'}`);
        break;
    }
  };

  const settings = [
    {
      key: 'highContrast' as const,
      label: 'Высокий контраст',
      description: 'Улучшает видимость элементов интерфейса',
      icon: Eye,
    },
    {
      key: 'reducedMotion' as const,
      label: 'Уменьшенное движение',
      description: 'Отключает анимации для снижения нагрузки',
      icon: Volume2,
    },
    {
      key: 'largeText' as const,
      label: 'Большой текст',
      description: 'Увеличивает размер шрифта',
      icon: Type,
    },
    {
      key: 'keyboardNavigation' as const,
      label: 'Клавиатурная навигация',
      description: 'Включает навигацию с помощью клавиатуры',
      icon: Keyboard,
    },
    {
      key: 'focusVisible' as const,
      label: 'Видимый фокус',
      description: 'Показывает индикатор фокуса при навигации',
      icon: Focus,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Accessibility className="w-4 h-4" />
          <span className="sr-only">Настройки доступности</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Доступность
          </DialogTitle>
          <DialogDescription>
            Настройте параметры доступности для комфортной работы
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {settings.map((setting) => {
            const Icon = setting.icon;
            return (
              <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label htmlFor={setting.key} className="font-medium">
                      {setting.label}
                    </Label>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  id={setting.key}
                  checked={accessibilityState.settings[setting.key]}
                  onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                  aria-describedby={`${setting.key}-description`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Горячие клавиши</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">Alt</kbd> + <kbd className="px-1 py-0.5 bg-white rounded text-xs">1-9</kbd> - Пропустить к разделу</div>
            <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">Tab</kbd> - Навигация по элементам</div>
            <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">Enter</kbd> / <kbd className="px-1 py-0.5 bg-white rounded text-xs">Space</kbd> - Активация</div>
            <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">Escape</kbd> - Закрыть/Выйти</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Совместимость</h4>
          <p className="text-sm text-green-800">
            Приложение соответствует стандартам WCAG 2.1 AA и поддерживает:
          </p>
          <ul className="text-sm text-green-800 mt-2 space-y-1">
            <li>• Экранные читалки (NVDA, JAWS, VoiceOver)</li>
            <li>• Клавиатурную навигацию</li>
            <li>• Высокий контраст</li>
            <li>• Уменьшенное движение</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}