/**
 * Modal Component Tests
 *
 * Comprehensive test suite for the Modal UI component.
 * Tests cover:
 * - Modal rendering and visibility
 * - Opening and closing behavior
 * - Click outside to close (backdrop)
 * - Close button functionality
 * - Different sizes
 * - Children content
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

// Mock lucide-react X icon
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="close-icon">X</div>,
}));

describe('Modal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('should render title correctly', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Custom Title">
          <div>Content</div>
        </Modal>
      );

      const title = screen.getByText('Custom Title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });

    it('should render children content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div data-testid="custom-content">Custom Content Here</div>
        </Modal>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content Here')).toBeInTheDocument();
    });

    it('should render close icon button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });
  });

  describe('Closing behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop overlay is clicked', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      // Find the backdrop overlay by class
      const backdrop = container.querySelector('.bg-gray-500.bg-opacity-75');

      if (backdrop && backdrop.parentElement) {
        // The click handler is on the parent of the overlay
        fireEvent.click(backdrop.parentElement, { target: backdrop.parentElement });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('should not call onClose when modal content is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div data-testid="content">Content</div>
        </Modal>
      );

      const content = screen.getByTestId('content');
      fireEvent.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when title is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Clickable Title">
          <div>Content</div>
        </Modal>
      );

      const title = screen.getByText('Clickable Title');
      fireEvent.click(title);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('should render with default size (md)', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('.max-w-lg');
      expect(modalContent).toBeInTheDocument();
    });

    it('should render with small size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="sm">
          <div>Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('.max-w-md');
      expect(modalContent).toBeInTheDocument();
    });

    it('should render with medium size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="md">
          <div>Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('.max-w-lg');
      expect(modalContent).toBeInTheDocument();
    });

    it('should render with large size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="lg">
          <div>Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('.max-w-2xl');
      expect(modalContent).toBeInTheDocument();
    });
  });

  describe('Structure and styling', () => {
    it('should have fixed positioning', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv.className).toContain('fixed');
      expect(outerDiv.className).toContain('inset-0');
      expect(outerDiv.className).toContain('z-50');
    });

    it('should have background overlay', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const overlay = container.querySelector('.bg-gray-500.bg-opacity-75');
      expect(overlay).toBeInTheDocument();
    });

    it('should have header with border', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const header = container.querySelector('.border-b.border-gray-200');
      expect(header).toBeInTheDocument();
    });

    it('should have white background', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const modalContent = container.querySelector('.bg-white.rounded-lg');
      expect(modalContent).toBeInTheDocument();
    });
  });

  describe('Content types', () => {
    it('should render simple text content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Simple text content
        </Modal>
      );

      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render complex JSX content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>
            <h4>Heading</h4>
            <p>Paragraph</p>
            <button>Action</button>
          </div>
        </Modal>
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should render form content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Form Modal">
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      );

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should render list content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="List Modal">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </Modal>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Multiple modals', () => {
    it('should handle opening and closing multiple modals', () => {
      const onClose1 = jest.fn();
      const onClose2 = jest.fn();

      const { rerender } = render(
        <>
          <Modal isOpen={true} onClose={onClose1} title="Modal 1">
            Content 1
          </Modal>
          <Modal isOpen={false} onClose={onClose2} title="Modal 2">
            Content 2
          </Modal>
        </>
      );

      expect(screen.getByText('Modal 1')).toBeInTheDocument();
      expect(screen.queryByText('Modal 2')).not.toBeInTheDocument();

      // Switch modals
      rerender(
        <>
          <Modal isOpen={false} onClose={onClose1} title="Modal 1">
            Content 1
          </Modal>
          <Modal isOpen={true} onClose={onClose2} title="Modal 2">
            Content 2
          </Modal>
        </>
      );

      expect(screen.queryByText('Modal 1')).not.toBeInTheDocument();
      expect(screen.getByText('Modal 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Accessible Modal">
          <div>Content</div>
        </Modal>
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Accessible Modal');
    });

    it('should have clickable close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have visible close icon', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty title', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="">
          <div>Content</div>
        </Modal>
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('');
    });

    it('should handle empty children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Empty Modal">
          {null}
        </Modal>
      );

      expect(screen.getByText('Empty Modal')).toBeInTheDocument();
    });

    it('should handle toggling isOpen prop', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Toggle Modal">
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Toggle Modal')).toBeInTheDocument();

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Toggle Modal">
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByText('Toggle Modal')).not.toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Toggle Modal">
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Toggle Modal')).toBeInTheDocument();
    });

    it('should handle changing title while open', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Original Title">
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByText('Original Title')).toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Updated Title">
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });

    it('should handle changing content while open', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Original Content</div>
        </Modal>
      );

      expect(screen.getByText('Original Content')).toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Updated Content</div>
        </Modal>
      );

      expect(screen.queryByText('Original Content')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Content')).toBeInTheDocument();
    });

    it('should handle changing size while open', () => {
      const { container, rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="sm">
          <div>Content</div>
        </Modal>
      );

      expect(container.querySelector('.max-w-md')).toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="lg">
          <div>Content</div>
        </Modal>
      );

      expect(container.querySelector('.max-w-md')).not.toBeInTheDocument();
      expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
    });
  });

  describe('Close button styling', () => {
    it('should have hover styles on close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton.className).toContain('hover:text-gray-500');
      expect(closeButton.className).toContain('hover:bg-gray-100');
    });

    it('should have transition on close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton.className).toContain('transition-colors');
    });
  });
});
