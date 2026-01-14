'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useAI } from './useAI';
import { useVoiceCommands } from './useVoiceCommands';

interface ContextualSuggestion {
  id: string;
  type: 'action' | 'navigation' | 'content' | 'assistance';
  title: string;
  description: string;
  confidence: number;
  trigger: string;
  action?: () => void;
  metadata?: Record<string, any>;
}

interface ContextAnalysis {
  currentPage: string;
  userRole: string;
  recentActions: string[];
  timeOfDay: string;
  activeFeatures: string[];
  mood?: 'learning' | 'collaborating' | 'socializing' | 'resting';
}

interface ContextualAIState {
  suggestions: ContextualSuggestion[];
  isAnalyzing: boolean;
  lastAnalysis: Date | null;
  context: ContextAnalysis | null;
}

export const useContextualAI = () => {
  const { user } = useAuth();
  const { analyzeSentiment } = useAI();
  const { speak } = useVoiceCommands();

  const [state, setState] = useState<ContextualAIState>({
    suggestions: [],
    isAnalyzing: false,
    lastAnalysis: null,
    context: null,
  });

  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  // Analyze current context
  const analyzeContext = useCallback(async (
    currentPage: string,
    recentActions: string[] = []
  ): Promise<ContextAnalysis> => {
    const now = new Date();
    const hour = now.getHours();

    let timeOfDay = 'day';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Determine active features based on current page
    const activeFeatures = [];
    if (currentPage.includes('chat')) activeFeatures.push('chat');
    if (currentPage.includes('call')) activeFeatures.push('video');
    if (currentPage.includes('board')) activeFeatures.push('collaboration');
    if (currentPage.includes('files')) activeFeatures.push('files');

    // Analyze mood based on recent actions
    let mood: ContextAnalysis['mood'] = 'learning';
    const actionText = recentActions.join(' ').toLowerCase();
    if (actionText.includes('call') || actionText.includes('meet')) mood = 'collaborating';
    else if (actionText.includes('social') || actionText.includes('friend')) mood = 'socializing';
    else if (actionText.includes('break') || actionText.includes('rest')) mood = 'resting';

    const context: ContextAnalysis = {
      currentPage,
      userRole: user?.role || 'student',
      recentActions,
      timeOfDay,
      activeFeatures,
      mood,
    };

    setState(prev => ({ ...prev, context }));
    return context;
  }, [user?.role]);

  // Generate contextual suggestions
  const generateSuggestions = useCallback(async (context: ContextAnalysis): Promise<ContextualSuggestion[]> => {
    const suggestions: ContextualSuggestion[] = [];

    // Time-based suggestions
    if (context.timeOfDay === 'morning') {
      suggestions.push({
        id: 'morning-focus',
        type: 'assistance',
        title: 'Доброе утро! Готовы к продуктивному дню?',
        description: 'Рекомендую начать с планирования задач на сегодня',
        confidence: 0.8,
        trigger: 'morning',
        action: () => speak('Доброе утро! Начнем с планирования вашего учебного дня?'),
      });
    }

    // Role-based suggestions
    if (context.userRole === 'student') {
      if (context.activeFeatures.includes('chat')) {
        suggestions.push({
          id: 'study-group',
          type: 'action',
          title: 'Создать учебную группу',
          description: 'Пригласить одногруппников для совместного обучения',
          confidence: 0.7,
          trigger: 'chat-active',
          action: () => speak('Хотите создать учебную группу для совместного обучения?'),
        });
      }
    } else if (context.userRole === 'teacher') {
      suggestions.push({
        id: 'content-creation',
        type: 'content',
        title: 'Создать учебный материал',
        description: 'AI поможет сгенерировать интерактивный контент',
        confidence: 0.9,
        trigger: 'teacher-tools',
        action: () => speak('Могу помочь создать учебный материал с помощью AI'),
      });
    }

    // Feature-based suggestions
    if (context.activeFeatures.includes('video') && !context.activeFeatures.includes('collaboration')) {
      suggestions.push({
        id: 'screen-share',
        type: 'action',
        title: 'Демонстрация экрана',
        description: 'Поделиться экраном для лучшего объяснения',
        confidence: 0.6,
        trigger: 'video-active',
      });
    }

    // Mood-based suggestions
    if (context.mood === 'resting') {
      suggestions.push({
        id: 'break-activity',
        type: 'assistance',
        title: 'Время для перерыва',
        description: 'Рекомендую короткую медитацию или прогулку',
        confidence: 0.5,
        trigger: 'resting-mood',
        action: () => speak('Пора сделать перерыв. Хотите, я порекомендую занятие?'),
      });
    }

    // Recent actions analysis
    if (context.recentActions.some(action => action.includes('search'))) {
      suggestions.push({
        id: 'refine-search',
        type: 'assistance',
        title: 'Уточнить поиск',
        description: 'Использовать AI для более точных результатов',
        confidence: 0.7,
        trigger: 'search-action',
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }, [speak]);

  // Main function to get contextual suggestions
  const getContextualSuggestions = useCallback(async (
    currentPage: string,
    recentActions: string[] = []
  ): Promise<ContextualSuggestion[]> => {
    setState(prev => ({ ...prev, isAnalyzing: true }));

    try {
      const context = await analyzeContext(currentPage, recentActions);
      const suggestions = await generateSuggestions(context);

      setState(prev => ({
        ...prev,
        suggestions,
        isAnalyzing: false,
        lastAnalysis: new Date(),
      }));

      return suggestions;
    } catch (error) {
      console.error('Contextual AI analysis failed:', error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
      return [];
    }
  }, [analyzeContext, generateSuggestions]);

  // Auto-update suggestions based on user activity
  const updateContext = useCallback((newAction: string) => {
    setState(prev => ({
      ...prev,
      context: prev.context ? {
        ...prev.context,
        recentActions: [...prev.context.recentActions.slice(-4), newAction],
      } : null,
    }));

    // Debounce re-analysis
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(() => {
      if (state.context) {
        getContextualSuggestions(state.context.currentPage, state.context.recentActions);
      }
    }, 2000);
  }, [getContextualSuggestions, state.context]);

  // Suggest next action based on current context
  const suggestNextAction = useCallback(async (): Promise<ContextualSuggestion | null> => {
    if (!state.context) return null;

    const suggestions = await generateSuggestions(state.context);
    return suggestions[0] || null;
  }, [state.context, generateSuggestions]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  return {
    suggestions: state.suggestions,
    isAnalyzing: state.isAnalyzing,
    lastAnalysis: state.lastAnalysis,
    context: state.context,
    getContextualSuggestions,
    updateContext,
    suggestNextAction,
  };
};