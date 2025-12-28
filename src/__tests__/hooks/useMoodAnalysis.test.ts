import { renderHook, act } from '@testing-library/react';
import { useMoodAnalysis } from '@/hooks/useMoodAnalysis';

// Mock useAI
const mockAnalyzeSentiment = jest.fn();
jest.mock('@/hooks/useAI', () => ({
  useAI: () => ({
    analyzeSentiment: mockAnalyzeSentiment,
  }),
}));

describe('useMoodAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default mood', () => {
    const { result } = renderHook(() => useMoodAnalysis());

    expect(result.current.currentMood).toEqual({
      primaryColor: '#FF00FF',
      secondaryColor: '#00FFFF',
      accentColor: '#FFFF00',
      mood: 'energetic',
      intensity: 0.7,
    });

    expect(result.current.theme).toEqual({
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      gradients: [],
      animations: [],
    });
  });

  it('should analyze chat mood with positive messages', async () => {
    mockAnalyzeSentiment
      .mockResolvedValueOnce({ score: 0.8, magnitude: 0.6 })
      .mockResolvedValueOnce({ score: 0.7, magnitude: 0.5 });

    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    await act(async () => {
      await result.current.analyzeChatMood(['I am so happy!', 'This is great!']);
    });

    expect(result.current.currentMood.mood).toBe('joyful');
    expect(result.current.currentMood.primaryColor).toBe('#FF6B6B');
    expect(mockAnalyzeSentiment).toHaveBeenCalledTimes(2);
  });

  it('should analyze chat mood with negative messages', async () => {
    mockAnalyzeSentiment
      .mockResolvedValueOnce({ score: -0.6, magnitude: 0.4 })
      .mockResolvedValueOnce({ score: -0.5, magnitude: 0.3 });

    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    await act(async () => {
      await result.current.analyzeChatMood(['This is terrible', 'I hate this']);
    });

    expect(result.current.currentMood.mood).toBe('serious');
    expect(result.current.currentMood.primaryColor).toBe('#2C3E50');
  });

  it('should analyze chat mood with energetic messages', async () => {
    mockAnalyzeSentiment
      .mockResolvedValueOnce({ score: 0.2, magnitude: 0.9 })
      .mockResolvedValueOnce({ score: 0.1, magnitude: 0.8 });

    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    await act(async () => {
      await result.current.analyzeChatMood(['Let\'s party!', 'This is exciting!']);
    });

    expect(result.current.currentMood.mood).toBe('energetic');
    expect(result.current.currentMood.primaryColor).toBe('#E91E63');
  });

  it('should handle empty messages array', async () => {
    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    act(() => {
      result.current.analyzeChatMood([]);
    });

    // Should not change mood
    expect(result.current.currentMood.mood).toBe('energetic');
    expect(mockAnalyzeSentiment).not.toHaveBeenCalled();
  });

  it('should handle sentiment analysis errors gracefully', async () => {
    mockAnalyzeSentiment.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    await act(async () => {
      await result.current.analyzeChatMood(['Test message']);
    });

    // Should not crash, mood should remain default
    expect(result.current.currentMood.mood).toBe('energetic');
  });

  it('should allow manual mood setting', () => {
    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    const newMood = {
      primaryColor: '#00FF00',
      secondaryColor: '#FF0000',
      accentColor: '#0000FF',
      mood: 'creative' as const,
      intensity: 0.8,
    };

    act(() => {
      result.current.setMood(newMood);
    });

    expect(result.current.currentMood).toEqual(newMood);
  });

  it('should generate theme based on mood', async () => {
    mockAnalyzeSentiment.mockResolvedValue({ score: 0.5, magnitude: 0.7 });

    const { result } = renderHook(() => useMoodAnalysis('chat1'));

    await act(async () => {
      await result.current.analyzeChatMood(['Creative message']);
    });

    expect(result.current.theme.gradients).toHaveLength(3);
    expect(result.current.theme.background).toContain('linear-gradient');
  });
});