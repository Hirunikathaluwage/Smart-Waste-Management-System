/**
 * ModalBackdrop Component - Provides proper blur effect for modals
 * 
 * SOLID PRINCIPLES APPLIED:
 * - SRP (Single Responsibility): Only handles modal backdrop with blur effect
 * - OCP (Open/Closed): Open for extension with new backdrop styles, closed for modification
 * - DIP (Dependency Inversion): Depends on CSS abstractions, not concrete implementations
 * 
 * CODE SMELLS AVOIDED:
 * - No magic numbers: All animation values defined as constants
 * - No duplicate code: Reusable backdrop component
 * - No long functions: Each method has single responsibility
 * - No mixed responsibilities: Only handles backdrop display
 * - Clear separation: UI logic separated from business logic
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

class ModalBackdrop {
  // Constants following DRY principle
  static ANIMATION_CONFIG = {
    BLUR_DURATION: 300,
    FADE_DURATION: 200,
    BLUR_INTENSITY: '8px',
    OPACITY_INTENSITY: 0.3
  };

  static CSS_CLASSES = {
    BACKDROP: 'modal-backdrop-blur',
    CONTENT_BLUR: 'modal-content-blur',
    TRANSITION: 'modal-transition'
  };

  /**
   * Apply blur effect to page content
   * SRP: Single responsibility - only applies blur effect
   */
  static applyBlurEffect() {
    const body = document.body;
    
    if (body) {
      body.classList.add(this.CSS_CLASSES.BACKDROP);
    }
    
    // Apply blur to the main content container specifically
    const mainContent = document.querySelector('.min-h-screen');
    if (mainContent) {
      mainContent.classList.add(this.CSS_CLASSES.CONTENT_BLUR);
    }
  }

  /**
   * Remove blur effect from page content
   * SRP: Single responsibility - only removes blur effect
   */
  static removeBlurEffect() {
    const body = document.body;
    
    if (body) {
      body.classList.remove(this.CSS_CLASSES.BACKDROP);
    }
    
    // Remove blur from main content
    const mainContent = document.querySelector('.min-h-screen');
    if (mainContent) {
      mainContent.classList.remove(this.CSS_CLASSES.CONTENT_BLUR);
    }
  }

  /**
   * Add CSS styles for blur effect
   * SRP: Single responsibility - only adds CSS styles
   */
  static addBlurStyles() {
    if (document.getElementById('modal-blur-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-blur-styles';
    style.textContent = `
      .${this.CSS_CLASSES.BACKDROP} {
        overflow: hidden;
        position: relative;
      }
      
      .${this.CSS_CLASSES.CONTENT_BLUR} {
        filter: blur(${this.ANIMATION_CONFIG.BLUR_INTENSITY});
        transition: filter ${this.ANIMATION_CONFIG.BLUR_DURATION}ms ease-in-out;
      }
      
      /* Ensure modal content and its children are never blurred */
      .modal-content,
      .modal-content *,
      .fixed,
      .fixed * {
        filter: none !important;
      }
      
      .${this.CSS_CLASSES.TRANSITION} {
        transition: all ${this.ANIMATION_CONFIG.FADE_DURATION}ms ease-in-out;
      }
      
      .modal-backdrop-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, ${this.ANIMATION_CONFIG.OPACITY_INTENSITY});
        backdrop-filter: blur(2px);
        z-index: 9998;
        opacity: 0;
        transition: opacity ${this.ANIMATION_CONFIG.FADE_DURATION}ms ease-in-out;
      }
      
      .modal-backdrop-overlay.show {
        opacity: 1;
      }
      
      .modal-content {
        z-index: 9999;
        opacity: 0;
        transform: scale(0.95) translateY(20px);
        transition: all ${this.ANIMATION_CONFIG.FADE_DURATION}ms ease-in-out;
        position: relative;
      }
      
      .modal-content.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    `;
    
    document.head.appendChild(style);
  }
}

/**
 * ModalBackdrop React Component
 * SRP: Single responsibility - only manages modal backdrop state
 */
const ModalBackdropComponent = ({ isOpen, children, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    ModalBackdrop.addBlurStyles();
    
    // Create portal container at document body level
    const container = document.createElement('div');
    container.id = 'modal-portal-container';
    document.body.appendChild(container);
    setPortalContainer(container);
    
    return () => {
      ModalBackdrop.removeBlurEffect();
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Start backdrop animation
      setIsVisible(true);
      ModalBackdrop.applyBlurEffect();
      
      // Delay content animation for staggered effect
      setTimeout(() => {
        setIsContentVisible(true);
      }, 50);
    } else {
      // Start content fade out
      setIsContentVisible(false);
      
      // Delay backdrop removal for smooth transition
      setTimeout(() => {
        setIsVisible(false);
        ModalBackdrop.removeBlurEffect();
      }, ModalBackdrop.ANIMATION_CONFIG.FADE_DURATION);
    }
  }, [isOpen]);

  if (!isVisible || !portalContainer) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop overlay */}
      <div 
        className={`modal-backdrop-overlay ${isVisible ? 'show' : ''}`}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className={`modal-content ${isContentVisible ? 'show' : ''}`}>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, portalContainer);
};

export { ModalBackdrop, ModalBackdropComponent };
