import { renderHook, act } from '@testing-library/react';
import { useAchievements } from '@/hooks/useAchievements';

describe('useAchievements', () => {
  it('should initialize with default achievements', () => {
    const { result } = renderHook(() => useAchievements());

    expect(result.current.achievements).toHaveLength(4);
    expect(result.current.achievements[0]).toMatchObject({
      id: 'first_message',
      title: 'Первый шаг',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
    });
  });

  it('should unlock an achievement', () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      result.current.unlockAchievement('first_message');
    });

    expect(result.current.achievements[0].unlocked).toBe(true);
    expect(result.current.achievements[0].progress).toBe(1);
  });

  it('should update progress', () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      result.current.updateProgress('chat_master', 50);
    });

    expect(result.current.achievements[1].progress).toBe(50);
    expect(result.current.achievements[1].unlocked).toBe(false);

    act(() => {
      result.current.updateProgress('chat_master', 100);
    });

    expect(result.current.achievements[1].progress).toBe(100);
    expect(result.current.achievements[1].unlocked).toBe(true);
  });

  it('should not exceed max progress', () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      result.current.updateProgress('first_message', 5);
    });

    expect(result.current.achievements[0].progress).toBe(1);
    expect(result.current.achievements[0].unlocked).toBe(true);
  });

  it('should handle non-existent achievement', () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      result.current.unlockAchievement('non-existent');
    });

    // Should not crash, achievements should remain unchanged
    expect(result.current.achievements).toHaveLength(4);
  });
});