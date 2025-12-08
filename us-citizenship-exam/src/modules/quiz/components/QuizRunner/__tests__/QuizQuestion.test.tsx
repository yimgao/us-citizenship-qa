/**
 * Tests for QuizQuestion component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestion } from '../QuizQuestion';
import type { Question } from '@/core/types';

const mockQuestion: Question = {
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

describe('QuizQuestion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render question text', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    mockQuestion.options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should call onAnswer when option is clicked', () => {
    const onAnswer = jest.fn();

    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={onAnswer}
        tts={mockTTS}
      />
    );

    const firstOption = screen.getByText(mockQuestion.options[0]);
    fireEvent.click(firstOption);

    expect(onAnswer).toHaveBeenCalledWith(mockQuestion.id, '0');
  });

  it('should show TTS button when TTS is supported', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    const ttsButton = screen.getByLabelText('Read aloud');
    expect(ttsButton).toBeInTheDocument();
  });

  it('should not show TTS button when TTS is not supported', () => {
    const unsupportedTTS = { ...mockTTS, isSupported: false };

    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={unsupportedTTS}
      />
    );

    const ttsButton = screen.queryByLabelText('Read aloud');
    expect(ttsButton).not.toBeInTheDocument();
  });

  it('should call TTS speak when TTS button is clicked', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    const ttsButton = screen.getByLabelText('Read aloud');
    fireEvent.click(ttsButton);

    expect(mockTTS.speak).toHaveBeenCalledWith(mockQuestion.text);
  });

  it('should call TTS stop when TTS button is clicked while speaking', () => {
    const speakingTTS = { ...mockTTS, state: 'speaking' as const };

    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={speakingTTS}
      />
    );

    const ttsButton = screen.getByLabelText('Stop reading');
    fireEvent.click(ttsButton);

    expect(mockTTS.stop).toHaveBeenCalled();
  });

  it('should disable options in practice mode after answering', () => {
    const onAnswer = jest.fn();

    render(
      <QuizQuestion
        question={mockQuestion}
        selected="0"
        isAnswered={true}
        isTestMode={false}
        onAnswer={onAnswer}
        tts={mockTTS}
      />
    );

    const options = screen.getAllByRole('button').filter((btn) =>
      mockQuestion.options.some((opt) => btn.textContent?.includes(opt))
    );

    options.forEach((option) => {
      expect(option).toBeDisabled();
    });
  });

  it('should not disable options in test mode after answering', () => {
    const onAnswer = jest.fn();

    render(
      <QuizQuestion
        question={mockQuestion}
        selected="0"
        isAnswered={true}
        isTestMode={true}
        onAnswer={onAnswer}
        tts={mockTTS}
      />
    );

    const firstOption = screen.getByText(mockQuestion.options[0]);
    expect(firstOption).not.toBeDisabled();
  });

  it('should show correct answer indicator in practice mode', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected="0"
        isAnswered={true}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    // Should show check icon for correct answer
    const checkIcon = screen.getByRole('img', { hidden: true });
    expect(checkIcon).toBeInTheDocument();
  });

  it('should highlight selected option in test mode', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected="1"
        isAnswered={false}
        isTestMode={true}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    const selectedButton = screen.getByText(mockQuestion.options[1]).closest('button');
    expect(selectedButton).toHaveClass('bg-blue-50');
  });

  it('should call TTS speak for option when option TTS button is clicked', () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        selected={undefined}
        isAnswered={false}
        isTestMode={false}
        onAnswer={jest.fn()}
        tts={mockTTS}
      />
    );

    // Find option TTS buttons (they have aria-label "Read this option aloud")
    const optionTTSButtons = screen.getAllByLabelText('Read this option aloud');
    if (optionTTSButtons.length > 0) {
      fireEvent.click(optionTTSButtons[0]);
      expect(mockTTS.speak).toHaveBeenCalled();
    }
  });
});
