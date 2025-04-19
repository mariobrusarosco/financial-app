import { describe, it, expect, vi } from 'vitest';
import { render } from './render-utils';
import { createMockUser } from './test-data';
import { screen } from '@testing-library/react';

// A simple component to test
function ExampleComponent({ name }: { name: string }) {
  return <div data-testid="example">Hello, {name}!</div>;
}

describe('Example Test Suite', () => {
  it('renders properly', () => {
    const user = createMockUser({ name: 'Jane' });
    render(<ExampleComponent name={user.name} />);
    
    expect(screen.getByTestId('example')).toBeInTheDocument();
    expect(screen.getByText('Hello, Jane!')).toBeInTheDocument();
  });

  it('demonstrates mocking', () => {
    const mockFn = vi.fn().mockReturnValue('mocked value');
    expect(mockFn()).toBe('mocked value');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('handles async tests', async () => {
    const asyncFn = vi.fn().mockResolvedValue('async result');
    const result = await asyncFn();
    
    expect(result).toBe('async result');
    expect(asyncFn).toHaveBeenCalled();
  });
}); 