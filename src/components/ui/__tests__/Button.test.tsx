/**
 * Button Component Tests
 *
 * Comprehensive test suite for the Button UI component.
 * Tests cover:
 * - Rendering with different variants
 * - Different sizes
 * - Click handlers
 * - Disabled state
 * - Custom className
 * - Children content
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with children text', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render with default variant (primary)', () => {
      render(<Button>Primary Button</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-blue-500');
      expect(button.className).toContain('text-white');
    });

    it('should render with default size (md)', () => {
      render(<Button>Medium Button</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-sm');
    });
  });

  describe('Variants', () => {
    it('should render primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-blue-500');
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('hover:bg-blue-600');
      expect(button.className).toContain('focus:ring-blue-500');
    });

    it('should render secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gray-500');
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('hover:bg-gray-600');
      expect(button.className).toContain('focus:ring-gray-500');
    });

    it('should render outline variant correctly', () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('border');
      expect(button.className).toContain('border-gray-300');
      expect(button.className).toContain('text-gray-700');
      expect(button.className).toContain('hover:bg-gray-50');
      expect(button.className).toContain('focus:ring-gray-500');
    });

    it('should render ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('text-gray-700');
      expect(button.className).toContain('hover:bg-gray-100');
      expect(button.className).toContain('focus:ring-gray-500');
    });
  });

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
      expect(button.className).toContain('text-sm');
    });

    it('should render medium size correctly', () => {
      render(<Button size="md">Medium</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-sm');
    });

    it('should render large size correctly', () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
      expect(button.className).toContain('text-base');
    });
  });

  describe('Click handlers', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should work without onClick handler', () => {
      render(<Button>No Handler</Button>);

      const button = screen.getByRole('button');

      // Should not throw error
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });

    it('should handle multiple clicks', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Multiple Clicks</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<Button>Enabled</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should apply disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('opacity-50');
      expect(button.className).toContain('cursor-not-allowed');
    });

    it('should apply enabled styles when not disabled', () => {
      render(<Button>Enabled</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('cursor-pointer');
      expect(button.className).not.toContain('cursor-not-allowed');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<Button className="mt-4 custom">Custom</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('mt-4');
      expect(button.className).toContain('custom');
      expect(button.className).toContain('bg-blue-500'); // Default primary
    });

    it('should work with empty className', () => {
      render(<Button className="">Empty className</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Children content', () => {
    it('should render text children', () => {
      render(<Button>Text Content</Button>);

      expect(screen.getByText('Text Content')).toBeInTheDocument();
    });

    it('should render JSX children', () => {
      render(
        <Button>
          <span data-testid="icon">Icon</span>
          <span>Text</span>
        </Button>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should render with multiple child elements', () => {
      render(
        <Button>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </Button>
      );

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have focus ring styles', () => {
      render(<Button>Focus me</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
    });

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();
    });

    it('should have button role', () => {
      render(<Button>Button</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Combinations', () => {
    it('should handle variant, size, and className together', () => {
      render(
        <Button variant="secondary" size="lg" className="custom">
          Combined
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gray-500'); // secondary
      expect(button.className).toContain('px-6'); // large
      expect(button.className).toContain('custom'); // custom class
    });

    it('should handle all props together', () => {
      const handleClick = jest.fn();
      render(
        <Button
          variant="outline"
          size="sm"
          className="my-custom"
          onClick={handleClick}
          disabled={false}
        >
          All Props
        </Button>
      );

      const button = screen.getByRole('button');

      // Should render correctly
      expect(button).toBeInTheDocument();
      expect(button.className).toContain('border');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('my-custom');
      expect(button).not.toBeDisabled();

      // Should handle click
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });

    it('should handle disabled state with all variants', () => {
      const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost'> = [
        'primary',
        'secondary',
        'outline',
        'ghost',
      ];

      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant} disabled>
            {variant}
          </Button>
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button.className).toContain('opacity-50');

        unmount();
      });
    });
  });

  describe('Base styles', () => {
    it('should always include base classes', () => {
      render(<Button>Base</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('font-medium');
      expect(button.className).toContain('rounded-lg');
      expect(button.className).toContain('transition-all');
      expect(button.className).toContain('duration-200');
    });

    it('should include base classes for all variants', () => {
      const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost'> = [
        'primary',
        'secondary',
        'outline',
        'ghost',
      ];

      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);

        const button = screen.getByRole('button');
        expect(button.className).toContain('font-medium');
        expect(button.className).toContain('rounded-lg');

        unmount();
      });
    });
  });
});
