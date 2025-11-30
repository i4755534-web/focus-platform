'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  CheckCircle,
  AlertTriangle,
  X,
  Clock,
  Package,
  Zap,
  Shield,
  Settings,
  RefreshCw
} from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: {
    name: string;
    verified: boolean;
  };
  category: 'chat' | 'moderation' | 'gamification' | 'productivity' | 'security' | 'integration';
  dependencies: Dependency[];
  conflicts: string[];
  size: string;
  price: number;
  currency: string;
}

interface Dependency {
  id: string;
  name: string;
  version: string;
  required: boolean;
  installed?: boolean;
  installing?: boolean;
}

interface InstallationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
}

interface PluginInstallerProps {
  plugin: Plugin;
  onClose: () => void;
  onInstallComplete: (pluginId: string) => void;
}

export default function PluginInstaller({ plugin, onClose, onInstallComplete }: PluginInstallerProps) {
  // Initialize installation steps
  const initialSteps: InstallationStep[] = [
    { id: 'check-dependencies', name: 'Проверка зависимостей', status: 'pending' },
    { id: 'check-conflicts', name: 'Проверка конфликтов', status: 'pending' },
    { id: 'download-plugin', name: 'Загрузка плагина', status: 'pending' },
    { id: 'install-dependencies', name: 'Установка зависимостей', status: 'pending' },
    { id: 'install-plugin', name: 'Установка плагина', status: 'pending' },
    { id: 'configure-plugin', name: 'Настройка плагина', status: 'pending' },
    { id: 'verify-installation', name: 'Проверка установки', status: 'pending' },
  ];

  // Mock dependencies and conflicts
  const initialDependencies: Dependency[] = [
    { id: 'react', name: 'React', version: '18.0+', required: true, installed: true },
    { id: 'zustand', name: 'Zustand', version: '4.0+', required: true, installed: false },
    { id: 'lucide-react', name: 'Lucide React', version: '0.200+', required: false, installed: true },
  ];

  const [installationSteps, setInstallationSteps] = useState<InstallationStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [dependencies, setDependencies] = useState<Dependency[]>(initialDependencies);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>(['Этот плагин может повлиять на производительность при большом количестве пользователей']);

  const startInstallation = async () => {
    setIsInstalling(true);
    setCurrentStep(0);

    for (let i = 0; i < installationSteps.length; i++) {
      const step = installationSteps[i];
      setCurrentStep(i);

      // Update step status to running
      setInstallationSteps(prev => prev.map(s =>
        s.id === step.id ? { ...s, status: 'running' as const } : s
      ));

      // Simulate step execution
      await simulateStep(step.id);

      // Update step status to completed
      setInstallationSteps(prev => prev.map(s =>
        s.id === step.id ? { ...s, status: 'completed' as const } : s
      ));

      // Update overall progress
      setOverallProgress(((i + 1) / installationSteps.length) * 100);
    }

    setIsInstalling(false);
    onInstallComplete(plugin.id);
  };

  const simulateStep = async (stepId: string): Promise<void> => {
    return new Promise((resolve) => {
      const duration = Math.random() * 2000 + 1000; // 1-3 seconds
      setTimeout(() => {
        // Simulate progress updates for download steps
        if (stepId === 'download-plugin' || stepId === 'install-dependencies') {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
            }
            setInstallationSteps(prev => prev.map(s =>
              s.id === stepId ? { ...s, progress } : s
            ));
          }, 200);
        }
        resolve();
      }, duration);
    });
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chat':
        return <Package className="w-5 h-5" />;
      case 'moderation':
        return <Shield className="w-5 h-5" />;
      case 'gamification':
        return <Zap className="w-5 h-5" />;
      case 'productivity':
        return <Settings className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const hasUnresolvedDependencies = dependencies.some(dep => dep.required && !dep.installed);
  const hasConflicts = conflicts.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {getCategoryIcon(plugin.category)}
              </div>
              <div>
                <CardTitle className="text-xl">Установка плагина</CardTitle>
                <CardDescription>{plugin.name} v{plugin.version}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Plugin Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Автор</p>
              <p className="font-medium">{plugin.author.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Размер</p>
              <p className="font-medium">{plugin.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Цена</p>
              <p className="font-medium">{plugin.price} {plugin.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Категория</p>
              <Badge variant="secondary">{plugin.category}</Badge>
            </div>
          </div>

          {/* Dependencies */}
          {dependencies.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Зависимости</h3>
              <div className="space-y-2">
                {dependencies.map((dep) => (
                  <div key={dep.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {dep.installed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : dep.installing ? (
                        <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{dep.name}</p>
                        <p className="text-sm text-gray-600">v{dep.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dep.required && <Badge variant="destructive">Обязательно</Badge>}
                      {dep.installed && <Badge variant="outline" className="text-green-600">Установлено</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Конфликты обнаружены:</strong> {conflicts.join(', ')}
              </AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Предупреждения:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Installation Progress */}
          {isInstalling && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Прогресс установки</h3>
                <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="mb-4" />

              <div className="space-y-2">
                {installationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3 p-2 rounded">
                    {getStepIcon(step.status)}
                    <span className={`text-sm ${index === currentStep ? 'font-medium' : ''}`}>
                      {step.name}
                    </span>
                    {step.progress !== undefined && (
                      <div className="ml-auto flex items-center gap-2">
                        <Progress value={step.progress} className="w-20" />
                        <span className="text-xs text-gray-600">{Math.round(step.progress)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={startInstallation}
              disabled={isInstalling || hasUnresolvedDependencies || hasConflicts}
              className="flex-1"
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Установка...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Установить
                </>
              )}
            </Button>
          </div>

          {hasUnresolvedDependencies && (
            <p className="text-sm text-red-600 text-center">
              Невозможно установить: отсутствуют обязательные зависимости
            </p>
          )}

          {hasConflicts && (
            <p className="text-sm text-red-600 text-center">
              Невозможно установить: обнаружены конфликты
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}