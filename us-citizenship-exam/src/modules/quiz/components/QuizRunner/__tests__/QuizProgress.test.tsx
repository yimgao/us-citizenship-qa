/**
 * Tests for QuizProgress component
 */

import { render, screen } from '@testing-library/react';
import { QuizProgress } from '../QuizProgress';

describe('QuizProgress', () => {
  it('should render progress information', () => {
    render(<QuizProgress current={5} total={10} isTestMode={false} />);

    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('should display percentage', () => {
    render(<QuizProgress current={3} total={10} isTestMode={false} />);

    const percentage = Math.round((3 / 10) * 100);
    expect(screen.getByText(new RegExp(`${percentage}`))).toBeInTheDocument();
  });

  it('should show pass threshold in test mode', () => {
    render(<QuizProgress current={5} total={20} isTestMode={true} />);

    // Should show the needToPass message
    expect(screen.getByText(/12/)).toBeInTheDocument(); // PASS_THRESHOLD = 12
  });

  it('should not show pass threshold in practice mode', () => {
    const { container } = render(
      <QuizProgress current={5} total={10} isTestMode={false} />
    );

    // Should not show the threshold message
    const thresholdText = container.textContent;
    expect(thresholdText).not.toContain('12');
  });

  it('should render progress bar with correct width', () => {
    const { container } = render(
      <QuizProgress current={7} total={10} isTestMode={false} />
    );

    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar?.getAttribute('style')).toContain('width: 70%');
  });

  it('should handle 0% progress', () => {
    render(<QuizProgress current={0} total={10} isTestMode={false} />);

    expect(screen.getByText(/0/)).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    render(<QuizProgress current={10} total={10} isTestMode={false} />);

    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it('should round percentage correctly', () => {
    const { container } = render(
      <QuizProgress current={1} total={3} isTestMode={false} />
    );

    // 1/3 = 33.33%, should round to 33%
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar?.getAttribute('style')).toContain('width: 33.333333333333336%');
    // But displayed percentage should be rounded
    expect(screen.getByText(/33%/)).toBeInTheDocument();
  });
});
