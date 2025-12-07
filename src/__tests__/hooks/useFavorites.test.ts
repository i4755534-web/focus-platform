import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '@/hooks/useFavorites';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useFavorites', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  it('should add a favorite item', () => {
    const { result } = renderHook(() => useFavorites());

    const favoriteItem = {
      type: 'message' as const,
      chatId: 'chat-1',
      content: 'Test message',
    };

    act(() => {
      result.current.addFavorite(favoriteItem);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0]).toMatchObject(favoriteItem);
    expect(result.current.favorites[0].id).toBeDefined();
    expect(result.current.favorites[0].timestamp).toBeInstanceOf(Date);
  });

  it('should check if item is favorite', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite('non-existent')).toBe(false);

    const favoriteItem = {
      type: 'message' as const,
      chatId: 'chat-1',
      content: 'Test message',
    };

    act(() => {
      result.current.addFavorite(favoriteItem);
    });

    const addedItem = result.current.favorites[0];
    expect(result.current.isFavorite(addedItem.id)).toBe(true);
  });
});