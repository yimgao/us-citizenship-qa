/**
 * Tests for cn utility function
 */

import { cn } from '../cn';

describe('cn', () => {
  it('should merge class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional class names', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  it('should handle object-based conditional classes', () => {
    const result = cn({
      foo: true,
      bar: false,
      baz: true,
    });
    expect(result).toBe('foo baz');
  });

  it('should handle array of class names', () => {
    const result = cn(['foo', 'bar'], 'baz');
    expect(result).toBe('foo bar baz');
  });

  it('should merge Tailwind classes and resolve conflicts', () => {
    // tailwind-merge should resolve conflicts
    const result = cn('p-4', 'p-6');
    expect(result).toBe('p-6'); // Last one wins
  });

  it('should handle undefined and null values', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle empty strings', () => {
    const result = cn('foo', '', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle mixed inputs', () => {
    const result = cn(
      'base-class',
      {
        'conditional-true': true,
        'conditional-false': false,
      },
      ['array-class-1', 'array-class-2'],
      undefined,
      null,
      'final-class'
    );
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-true');
    expect(result).not.toContain('conditional-false');
    expect(result).toContain('array-class-1');
    expect(result).toContain('array-class-2');
    expect(result).toContain('final-class');
  });

  it('should resolve Tailwind responsive class conflicts', () => {
    const result = cn('p-4 md:p-6', 'p-8');
    // Should keep responsive classes and resolve base conflict
    expect(result).toContain('md:p-6');
    expect(result).toContain('p-8');
  });

  it('should handle no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex Tailwind class merging', () => {
    // Test that tailwind-merge properly handles conflicting utilities
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500'); // Last one should win
  });

  it('should preserve non-conflicting classes', () => {
    const result = cn('text-center', 'font-bold', 'bg-blue-500');
    expect(result).toContain('text-center');
    expect(result).toContain('font-bold');
    expect(result).toContain('bg-blue-500');
  });
});
