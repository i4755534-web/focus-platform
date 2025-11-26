'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

export interface AccessibilityState {
  settings: AccessibilitySettings;
  announcements: string[];
  focusTraps: Set<string>;
  skipLinks: boolean;
}

export const useAccessibility = () => {
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    settings: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: true,
      focusVisible: true,
    },
    announcements: [],
    focusTraps: new Set(),
    skipLinks: true,
  });

  // Initialize accessibility settings
  useEffect(() => {
    const initAccessibility = () => {
      // Check for system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersLargeText = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // Approximation

      // Check for screen reader
      const isScreenReader = navigator.userAgent.includes('NVDA') ||
                           navigator.userAgent.includes('JAWS') ||
                           navigator.userAgent.includes('VoiceOver');

      setAccessibilityState(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          reducedMotion: prefersReducedMotion,
          highContrast: prefersHighContrast,
          largeText: prefersLargeText,
          screenReader: isScreenReader,
        },
      }));

      // Load saved settings
      const saved = localStorage.getItem('focus-accessibility');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAccessibilityState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...parsed },
          }));
        } catch (error) {
          logger.error('Failed to load accessibility settings', error as Error);
        }
      }

      logger.info('Accessibility initialized', {
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
        screenReader: isScreenReader,
      });
    };

    initAccessibility();
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibilityState(prev => {
      const newSettings = { ...prev.settings, ...settings };
      localStorage.setItem('focus-accessibility', JSON.stringify(newSettings));
      return { ...prev, settings: newSettings };
    });
  }, []);

  // Toggle high contrast mode
  const toggleHighContrast = useCallback(() => {
    const newValue = !accessibilityState.settings.highContrast;
    saveSettings({ highContrast: newValue });

    // Apply to document
    document.documentElement.classList.toggle('high-contrast', newValue);

    announce(`Высокий контраст ${newValue ? 'включен' : 'отключен'}`);
  }, [accessibilityState.settings.highContrast, saveSettings]);

  // Toggle reduced motion
  const toggleReducedMotion = useCallback(() => {
    const newValue = !accessibilityState.settings.reducedMotion;
    saveSettings({ reducedMotion: newValue });

    // Apply to document
    document.documentElement.style.setProperty('--animation-duration', newValue ? '0s' : '0.3s');

    announce(`Уменьшенное движение ${newValue ? 'включено' : 'отключено'}`);
  }, [accessibilityState.settings.reducedMotion, saveSettings]);

  // Toggle large text
  const toggleLargeText = useCallback(() => {
    const newValue = !accessibilityState.settings.largeText;
    saveSettings({ largeText: newValue });

    // Apply to document
    document.documentElement.classList.toggle('large-text', newValue);

    announce(`Большой текст ${newValue ? 'включен' : 'отключен'}`);
  }, [accessibilityState.settings.largeText, saveSettings]);

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAccessibilityState(prev => ({
      ...prev,
      announcements: [...prev.announcements, message],
    }));

    // Create live region if it doesn't exist
    let liveRegion = document.getElementById('accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-live-region';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // Announce the message
    liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      liveRegion!.textContent = '';
      setAccessibilityState(prev => ({
        ...prev,
        announcements: prev.announcements.filter(a => a !== message),
      }));
    }, 1000);

    logger.info('Accessibility announcement', { message, priority });
  }, []);

  // Focus management
  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      if (accessibilityState.settings.focusVisible) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      logger.info('Focused element', { selector });
    }
  }, [accessibilityState.settings.focusVisible]);

  // Skip link functionality
  const handleSkipLink = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
      announce(`Переход к ${target.getAttribute('aria-label') || targetId}`);
    }
  }, [announce]);

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!accessibilityState.settings.keyboardNavigation) return;

    // Skip links (Alt + number)
    if (event.altKey && event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      const skipLinks = document.querySelectorAll('[data-skip-link]');
      const index = parseInt(event.key) - 1;
      if (skipLinks[index]) {
        (skipLinks[index] as HTMLElement).click();
      }
    }

    // Focus trap escape
    if (event.key === 'Escape') {
      const activeTrap = Array.from(accessibilityState.focusTraps).pop();
      if (activeTrap) {
        const trapElement = document.querySelector(`[data-focus-trap="${activeTrap}"]`) as HTMLElement;
        if (trapElement) {
          trapElement.focus();
        }
        setAccessibilityState(prev => {
          const newTraps = new Set(prev.focusTraps);
          newTraps.delete(activeTrap);
          return { ...prev, focusTraps: newTraps };
        });
      }
    }
  }, [accessibilityState.settings.keyboardNavigation, accessibilityState.focusTraps]);

  // Setup keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

  // ARIA utilities
  const createAriaProps = useCallback((props: {
    label?: string;
    labelledBy?: string;
    describedBy?: string;
    expanded?: boolean;
    controls?: string;
    current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    busy?: boolean;
    live?: 'off' | 'assertive' | 'polite';
    atomic?: boolean;
  }) => {
    const ariaProps: Record<string, any> = {};

    if (props.label) ariaProps['aria-label'] = props.label;
    if (props.labelledBy) ariaProps['aria-labelledby'] = props.labelledBy;
    if (props.describedBy) ariaProps['aria-describedby'] = props.describedBy;
    if (props.expanded !== undefined) ariaProps['aria-expanded'] = props.expanded;
    if (props.controls) ariaProps['aria-controls'] = props.controls;
    if (props.current !== undefined) ariaProps['aria-current'] = props.current;
    if (props.disabled) ariaProps['aria-disabled'] = true;
    if (props.required) ariaProps['aria-required'] = true;
    if (props.invalid) ariaProps['aria-invalid'] = true;
    if (props.busy) ariaProps['aria-busy'] = true;
    if (props.live) ariaProps['aria-live'] = props.live;
    if (props.atomic) ariaProps['aria-atomic'] = true;

    return ariaProps;
  }, []);

  // Color contrast checker (utility)
  const checkColorContrast = useCallback((foreground: string, background: string): number => {
    // Simple contrast ratio calculation
    // In real implementation, use a proper color parsing library
    const getLuminance = (color: string): number => {
      // Placeholder implementation
      return color === '#000000' ? 0 : color === '#ffffff' ? 1 : 0.5;
    };

    const lum1 = getLuminance(foreground);
    const lum2 = getLuminance(background);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  return {
    accessibilityState,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    announce,
    focusElement,
    handleSkipLink,
    createAriaProps,
    checkColorContrast,
    saveSettings,
  };
};