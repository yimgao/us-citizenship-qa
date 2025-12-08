/**
 * Tests for useTTS hook
 */

import { renderHook, act } from '@testing-library/react';
import { useTTS, type TTSState } from '../useTTS';

// Mock SpeechSynthesis
const mockSpeak = jest.fn();
const mockCancel = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();
const mockGetVoices = jest.fn(() => [
  { lang: 'en-US', name: 'English (US)' },
  { lang: 'es-ES', name: 'Spanish (Spain)' },
  { lang: 'zh-CN', name: 'Chinese (China)' },
] as SpeechSynthesisVoice[]);

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

describe('useTTS', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.speechSynthesis
    global.window.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      pause: mockPause,
      resume: mockResume,
      getVoices: mockGetVoices,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    } as unknown as SpeechSynthesis;

    // Mock SpeechSynthesisUtterance
    global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
      text,
      lang: '',
      rate: 1,
      pitch: 1,
      volume: 1,
      voice: null,
      onstart: null,
      onend: null,
      onerror: null,
    })) as unknown as typeof SpeechSynthesisUtterance;
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useTTS('en'));

    expect(result.current.state).toBe('idle');
    expect(result.current.isSupported).toBe(true);
  });

  it('should detect browser support', () => {
    const { result } = renderHook(() => useTTS('en'));

    expect(result.current.isSupported).toBe(true);
  });

  it('should handle unsupported browser', () => {
    // Remove speechSynthesis
    const originalSynth = global.window.speechSynthesis;
    // @ts-expect-error - intentionally removing for test
    delete global.window.speechSynthesis;

    const { result } = renderHook(() => useTTS('en'));

    expect(result.current.isSupported).toBe(false);

    global.window.speechSynthesis = originalSynth;
  });

  it('should speak text when speak is called', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    act(() => {
      result.current.speak('Hello world');
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Hello world');
  });

  it('should update state to speaking when utterance starts', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    let utterance: SpeechSynthesisUtterance | null = null;
    (global.SpeechSynthesisUtterance as jest.Mock).mockImplementation((text) => {
      utterance = {
        text,
        lang: '',
        rate: 1,
        pitch: 1,
        volume: 1,
        voice: null,
        onstart: null,
        onend: null,
        onerror: null,
      } as SpeechSynthesisUtterance;
      return utterance;
    });

    act(() => {
      result.current.speak('Test');
    });

    if (utterance && utterance.onstart) {
      act(() => {
        utterance.onstart!({} as SpeechSynthesisEvent);
      });
    }

    expect(result.current.state).toBe('speaking');
  });

  it('should update state to idle when utterance ends', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    let utterance: SpeechSynthesisUtterance | null = null;
    (global.SpeechSynthesisUtterance as jest.Mock).mockImplementation((text) => {
      utterance = {
        text,
        lang: '',
        rate: 1,
        pitch: 1,
        volume: 1,
        voice: null,
        onstart: null,
        onend: null,
        onerror: null,
      } as SpeechSynthesisUtterance;
      return utterance;
    });

    act(() => {
      result.current.speak('Test');
    });

    if (utterance && utterance.onend) {
      act(() => {
        utterance.onend!({} as SpeechSynthesisEvent);
      });
    }

    expect(result.current.state).toBe('idle');
  });

  it('should stop speech when stop is called', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    act(() => {
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.state).toBe('idle');
  });

  it('should pause speech when pause is called', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    // Set state to speaking first
    act(() => {
      result.current.speak('Test');
    });

    // Mock state to be speaking
    const mockState: TTSState = 'speaking';
    jest.spyOn(result.current, 'state', 'get').mockReturnValue(mockState);

    act(() => {
      result.current.pause();
    });

    expect(mockPause).toHaveBeenCalled();
  });

  it('should resume speech when resume is called', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    act(() => {
      result.current.resume();
    });

    expect(mockResume).toHaveBeenCalled();
  });

  it('should handle different locales', async () => {
    const { result: enResult } = renderHook(() => useTTS('en'));
    const { result: esResult } = renderHook(() => useTTS('es'));
    const { result: zhResult } = renderHook(() => useTTS('zh'));

    await waitFor(() => {
      expect(enResult.current.isSupported).toBe(true);
      expect(esResult.current.isSupported).toBe(true);
      expect(zhResult.current.isSupported).toBe(true);
    });

    act(() => {
      enResult.current.speak('Hello');
      esResult.current.speak('Hola');
      zhResult.current.speak('你好');
    });

    expect(mockSpeak).toHaveBeenCalledTimes(3);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useTTS('en'));

    unmount();

    expect(mockCancel).toHaveBeenCalled();
  });

  it('should apply custom options when provided', async () => {
    const { result } = renderHook(() => useTTS('en'));

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    let utterance: SpeechSynthesisUtterance | null = null;
    (global.SpeechSynthesisUtterance as jest.Mock).mockImplementation((text) => {
      utterance = {
        text,
        lang: '',
        rate: 0.8,
        pitch: 1.2,
        volume: 0.9,
        voice: null,
        onstart: null,
        onend: null,
        onerror: null,
      } as SpeechSynthesisUtterance;
      return utterance;
    });

    act(() => {
      result.current.speak('Test', { rate: 0.8, pitch: 1.2, volume: 0.9 });
    });

    if (utterance) {
      expect(utterance.rate).toBe(0.8);
      expect(utterance.pitch).toBe(1.2);
      expect(utterance.volume).toBe(0.9);
    }
  });
});
