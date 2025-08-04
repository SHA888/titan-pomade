import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../input';
import React from 'react';

describe('Input Component', () => {
  it('renders a basic input field', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('renders with error state', () => {
    render(<Input error />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
  });

  it('displays helper text when provided', () => {
    render(<Input helperText="This is a helper text" />);
    const helperText = screen.getByText('This is a helper text');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-muted-foreground');
  });

  it('displays error styles when error is true', () => {
    render(<Input error helperText="This is an error" />);
    const input = screen.getByRole('textbox');
    const helperText = screen.getByText('This is an error');
    
    expect(input).toHaveClass('border-destructive');
    expect(helperText).toHaveClass('text-destructive');
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
