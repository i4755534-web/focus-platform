'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Check, Languages } from 'lucide-react';

export default function I18nPage() {
  const { t, currentLanguage, changeLanguage, availableLanguages } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6" />
            <div>
              <CardTitle>Internationalization (i18n)</CardTitle>
              <CardDescription>
                Управление языками и локализацией платформы FOCUS
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Language */}
      <Card>
        <CardHeader>
          <CardTitle>Текущий язык</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Languages className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {availableLanguages.find(lang => lang.code === currentLanguage)?.name}
              </h3>
              <p className="text-gray-600">Код языка: {currentLanguage.toUpperCase()}</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" />
              Активен
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Выбрать язык</CardTitle>
          <CardDescription>
            Измените язык интерфейса платформы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={currentLanguage} onValueChange={changeLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    <div className="flex items-center gap-2">
                      <span>{language.name}</span>
                      {language.code === currentLanguage && (
                        <Check className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableLanguages.map((language) => (
                <Button
                  key={language.code}
                  variant={language.code === currentLanguage ? 'default' : 'outline'}
                  onClick={() => changeLanguage(language.code)}
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                      {language.code.toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-xs text-gray-500">
                        {language.code === 'en' ? 'English' :
                         language.code === 'ru' ? 'Русский' :
                         language.code === 'es' ? 'Español' :
                         language.code === 'de' ? 'Deutsch' :
                         language.code === 'fr' ? 'Français' :
                         language.code === 'zh' ? '中文' :
                         language.code === 'ja' ? '日本語' : language.code}
                      </div>
                    </div>
                    {language.code === currentLanguage && (
                      <Check className="w-4 h-4 text-green-600 ml-auto" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Предварительный просмотр переводов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Общие элементы</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Сохранить:</strong> {t('common.save')}</div>
                  <div><strong>Отмена:</strong> {t('common.cancel')}</div>
                  <div><strong>Поиск:</strong> {t('common.search')}</div>
                  <div><strong>Загрузка:</strong> {t('common.loading')}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Аутентификация</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Вход:</strong> {t('auth.login')}</div>
                  <div><strong>Email:</strong> {t('auth.email')}</div>
                  <div><strong>Пароль:</strong> {t('auth.password')}</div>
                  <div><strong>Войти:</strong> {t('auth.loginButton')}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Чат</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Сообщения:</strong> {t('chat.messages')}</div>
                <div><strong>Отправить:</strong> {t('chat.send')}</div>
                <div><strong>Введите сообщение:</strong> {t('chat.typeMessage')}</div>
                <div><strong>Онлайн:</strong> {t('chat.online')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика языковой поддержки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{availableLanguages.length}</div>
              <p className="text-sm text-gray-600">Поддерживаемых языков</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <p className="text-sm text-gray-600">Переведено</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">250+</div>
              <p className="text-sm text-gray-600">Ключей перевода</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">7</div>
              <p className="text-sm text-gray-600">Категорий</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}