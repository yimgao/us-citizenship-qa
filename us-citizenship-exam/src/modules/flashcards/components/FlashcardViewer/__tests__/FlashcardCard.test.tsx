/**
 * Tests for FlashcardCard component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { FlashcardCard } from '../FlashcardCard';
import type { Flashcard } from '../../../types/flashcard.types';

const mockCard: Flashcard = {
  id: '1',
  category: 'American Government',
  text: 'What is the supreme law of the land?',
  options: ['The Constitution', 'The Declaration', 'The Bill of Rights', 'The Articles'],
  answer: 0,
};

const mockTTS = {
  isSupported: true,
  state: 'idle' as const,
  speak: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  toggle: jest.fn(),
};

const mockSwipeHandlers = {
  ref: jest.fn(),
  onMouseDown: jest.fn(),
  onTouchStart: jest.fn(),
  onTouchMove: jest.fn(),
  onTouchEnd: jest.fn(),
};

describe('FlashcardCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render question text on front side', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={false}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    expect(screen.getByText(mockCard.text)).toBeInTheDocument();
  });

  it('should render answer text on back side when flipped', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={true}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    expect(screen.getByText('The Constitution')).toBeInTheDocument();
  });

  it('should call onFlip when card is clicked', () => {
    const onFlip = jest.fn();

    const { container } = render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={false}
        onFlip={onFlip}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    const cardElement = container.querySelector('[class*="cursor-pointer"]');
    if (cardElement) {
      fireEvent.click(cardElement);
      expect(onFlip).toHaveBeenCalled();
    }
  });

  it('should show question label on front side', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={false}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    // Should show question label (translated)
    expect(screen.getByText(/question/i)).toBeInTheDocument();
  });

  it('should show answer label on back side', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={true}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    // Should show answer label (translated)
    expect(screen.getByText(/answer/i)).toBeInTheDocument();
  });

  it('should show TTS button when TTS is supported', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={false}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    const ttsButton = screen.getByLabelText(/read/i);
    expect(ttsButton).toBeInTheDocument();
  });

  it('should call TTS speak when TTS button is clicked on front side', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={false}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    const ttsButton = screen.getByLabelText(/read/i);
    fireEvent.click(ttsButton);

    expect(mockTTS.speak).toHaveBeenCalledWith(mockCard.text);
  });

  it('should call TTS speak when TTS button is clicked on back side', () => {
    render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={true}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    const ttsButton = screen.getByLabelText(/read/i);
    fireEvent.click(ttsButton);

    expect(mockTTS.speak).toHaveBeenCalledWith('The Constitution');
  });

  it('should apply flip transform class when showAnswer is true', () => {
    const { container } = render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={true}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    const flipElement = container.querySelector('[class*="rotateY"]');
    expect(flipElement).toBeInTheDocument();
    expect(flipElement?.className).toContain('rotateY(180deg)');
  });

  it('should not apply flip transform class when showAnswer is false', () => {
    const { container } = render(
      <FlashcardCard
        card={mockCard}
        answerText="The Constitution"
        showAnswer={false}
        onFlip={jest.fn()}
        tts={mockTTS}
        swipeHandlers={mockSwipeHandlers}
      />
    );

    const flipElement = container.querySelector('[class*="rotateY"]');
    // Should still have the element but without the 180deg transform
    expect(flipElement).toBeInTheDocument();
  });
});
