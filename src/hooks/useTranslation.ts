import { useState, useEffect } from 'react';

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

const translations: Record<string, TranslationDictionary> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      welcome: 'Welcome to FOCUS',
      dashboard: 'Dashboard',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
    },
    chat: {
      messages: 'Messages',
      send: 'Send',
      typeMessage: 'Type a message...',
      online: 'Online',
      offline: 'Offline',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      loginButton: 'Sign In',
      registerButton: 'Sign Up',
    },
  },
  ru: {
    common: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      create: 'Создать',
      search: 'Поиск',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      welcome: 'Добро пожаловать в FOCUS',
      dashboard: 'Панель управления',
      settings: 'Настройки',
      profile: 'Профиль',
      logout: 'Выйти',
    },
    chat: {
      messages: 'Сообщения',
      send: 'Отправить',
      typeMessage: 'Введите сообщение...',
      online: 'Онлайн',
      offline: 'Офлайн',
    },
    auth: {
      login: 'Вход',
      register: 'Регистрация',
      email: 'Email',
      password: 'Пароль',
      name: 'Имя',
      loginButton: 'Войти',
      registerButton: 'Зарегистрироваться',
    },
  },
  es: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      search: 'Buscar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      welcome: 'Bienvenido a FOCUS',
      dashboard: 'Panel de control',
      settings: 'Configuración',
      profile: 'Perfil',
      logout: 'Cerrar sesión',
    },
    chat: {
      messages: 'Mensajes',
      send: 'Enviar',
      typeMessage: 'Escribe un mensaje...',
      online: 'En línea',
      offline: 'Fuera de línea',
    },
    auth: {
      login: 'Iniciar sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      password: 'Contraseña',
      name: 'Nombre',
      loginButton: 'Iniciar sesión',
      registerButton: 'Registrarse',
    },
  },
  de: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      search: 'Suchen',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      welcome: 'Willkommen bei FOCUS',
      dashboard: 'Dashboard',
      settings: 'Einstellungen',
      profile: 'Profil',
      logout: 'Abmelden',
    },
    chat: {
      messages: 'Nachrichten',
      send: 'Senden',
      typeMessage: 'Nachricht eingeben...',
      online: 'Online',
      offline: 'Offline',
    },
    auth: {
      login: 'Anmelden',
      register: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      name: 'Name',
      loginButton: 'Anmelden',
      registerButton: 'Registrieren',
    },
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      search: 'Rechercher',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      welcome: 'Bienvenue sur FOCUS',
      dashboard: 'Tableau de bord',
      settings: 'Paramètres',
      profile: 'Profil',
      logout: 'Se déconnecter',
    },
    chat: {
      messages: 'Messages',
      send: 'Envoyer',
      typeMessage: 'Tapez un message...',
      online: 'En ligne',
      offline: 'Hors ligne',
    },
    auth: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom',
      loginButton: 'Se connecter',
      registerButton: 'S\'inscrire',
    },
  },
  zh: {
    common: {
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      create: '创建',
      search: '搜索',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      welcome: '欢迎使用 FOCUS',
      dashboard: '仪表板',
      settings: '设置',
      profile: '个人资料',
      logout: '登出',
    },
    chat: {
      messages: '消息',
      send: '发送',
      typeMessage: '输入消息...',
      online: '在线',
      offline: '离线',
    },
    auth: {
      login: '登录',
      register: '注册',
      email: '邮箱',
      password: '密码',
      name: '姓名',
      loginButton: '登录',
      registerButton: '注册',
    },
  },
  ja: {
    common: {
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      edit: '編集',
      create: '作成',
      search: '検索',
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      welcome: 'FOCUS へようこそ',
      dashboard: 'ダッシュボード',
      settings: '設定',
      profile: 'プロフィール',
      logout: 'ログアウト',
    },
    chat: {
      messages: 'メッセージ',
      send: '送信',
      typeMessage: 'メッセージを入力...',
      online: 'オンライン',
      offline: 'オフライン',
    },
    auth: {
      login: 'ログイン',
      register: '登録',
      email: 'メールアドレス',
      password: 'パスワード',
      name: '名前',
      loginButton: 'ログイン',
      registerButton: '登録',
    },
  },
};

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('focus-language');
    const browserLanguage = navigator.language.split('-')[0];

    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else if (translations[browserLanguage]) {
      setCurrentLanguage(browserLanguage);
    }
  }, []);

  const changeLanguage = (language: string) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('focus-language', language);
    }
  };

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value === 'string') {
      return value;
    }

    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value === 'string') {
      return value;
    }

    return defaultValue || key;
  };

  const availableLanguages = Object.keys(translations).map(code => ({
    code,
    name: code === 'en' ? 'English' :
          code === 'ru' ? 'Русский' :
          code === 'es' ? 'Español' :
          code === 'de' ? 'Deutsch' :
          code === 'fr' ? 'Français' :
          code === 'zh' ? '中文' :
          code === 'ja' ? '日本語' : code.toUpperCase(),
  }));

  return {
    t,
    currentLanguage,
    changeLanguage,
    availableLanguages,
  };
};