'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Smartphone,
  Apple,
  Smartphone as Android,
  Download,
  ExternalLink,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function MobilePage() {
  const mobileFeatures = [
    {
      title: 'Native iOS App',
      description: 'Полнофункциональное iOS приложение с нативной производительностью',
      platform: 'iOS',
      status: 'available',
      version: '2.1.0',
      downloads: 50000,
      rating: 4.8,
      features: [
        'Push notifications',
        'Offline mode',
        'Face ID / Touch ID',
        'iCloud sync',
        'Widget support',
        'Siri integration'
      ]
    },
    {
      title: 'Native Android App',
      description: 'Оптимизированное Android приложение с поддержкой всех устройств',
      platform: 'Android',
      status: 'available',
      version: '2.1.0',
      downloads: 120000,
      rating: 4.7,
      features: [
        'Material Design 3',
        'Google Play Services',
        'Offline capabilities',
        'Biometric authentication',
        'Widget support',
        'Google Assistant integration'
      ]
    },
    {
      title: 'Progressive Web App',
      description: 'PWA версия для всех современных браузеров',
      platform: 'Web',
      status: 'available',
      version: '3.0.0',
      downloads: 250000,
      rating: 4.6,
      features: [
        'Install to home screen',
        'Offline functionality',
        'Push notifications',
        'Background sync',
        'Responsive design',
        'Cross-platform compatibility'
      ]
    }
  ];

  const developmentRoadmap = [
    { phase: 'Q1 2024', items: ['iOS App Store release', 'Android Play Store release', 'PWA optimization'] },
    { phase: 'Q2 2024', items: ['Advanced offline mode', 'Biometric authentication', 'Cross-platform sync'] },
    { phase: 'Q3 2024', items: ['Voice commands integration', 'Advanced notifications', 'Wear OS support'] },
    { phase: 'Q4 2024', items: ['Enterprise MDM support', 'Advanced security features', 'Performance optimization'] }
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6" />
            <div>
              <CardTitle>Mobile Applications</CardTitle>
              <CardDescription>
                Нативные мобильные приложения и PWA для FOCUS платформы
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mobile Apps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mobileFeatures.map((app, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                {app.platform === 'iOS' && <Apple className="w-8 h-8 text-gray-900" />}
                {app.platform === 'Android' && <Android className="w-8 h-8 text-green-600" />}
                {app.platform === 'Web' && <Globe className="w-8 h-8 text-blue-600" />}
                <div>
                  <h3 className="font-semibold">{app.title}</h3>
                  <p className="text-sm text-gray-600">v{app.version}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{app.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{app.rating}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {app.downloads.toLocaleString()} downloads
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium">Key Features:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {app.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Development Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Development Roadmap</CardTitle>
          <CardDescription>
            План развития мобильных приложений FOCUS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {developmentRoadmap.map((phase, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-20 text-sm font-medium text-gray-600">{phase.phase}</div>
                <div className="flex-1">
                  <ul className="space-y-1">
                    {phase.items.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Development Status */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Development Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">iOS App Development</span>
                <span className="text-sm text-gray-600">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Android App Development</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">PWA Optimization</span>
                <span className="text-sm text-gray-600">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Cross-Platform Features</span>
                <span className="text-sm text-gray-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Features Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Matrix</CardTitle>
          <CardDescription>
            Сравнение возможностей мобильных приложений
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">iOS</th>
                  <th className="text-center py-2">Android</th>
                  <th className="text-center py-2">PWA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Push Notifications</td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Offline Mode</td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Biometric Auth</td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><AlertCircle className="w-4 h-4 text-yellow-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">App Store Distribution</td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><AlertCircle className="w-4 h-4 text-yellow-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Background Sync</td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center"><CheckCircle className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle>Download Mobile Apps</CardTitle>
          <CardDescription>
            Скачайте FOCUS для мобильных устройств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex-col gap-2" variant="outline">
              <Apple className="w-6 h-6" />
              <div>
                <div className="font-medium">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </Button>

            <Button className="h-16 flex-col gap-2" variant="outline">
              <Android className="w-6 h-6" />
              <div>
                <div className="font-medium">Get it on</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </Button>

            <Button className="h-16 flex-col gap-2" variant="outline">
              <Globe className="w-6 h-6" />
              <div>
                <div className="font-medium">Use as</div>
                <div className="text-lg font-bold">PWA</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}