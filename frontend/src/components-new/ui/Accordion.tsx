import React, { useState } from 'react';
import { Icon } from './Icon';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  variant?: 'default' | 'bordered' | 'flush';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  allowMultiple?: boolean;
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
}

/**
 * Akkordeon-Komponente
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  variant = 'default',
  size = 'md',
  className = '',
  allowMultiple = false,
  onItemToggle
}) => {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter(item => item.defaultOpen).map(item => item.id)
  );

  const handleItemToggle = (itemId: string) => {
    const isCurrentlyOpen = openItems.includes(itemId);
    let newOpenItems: string[];

    if (allowMultiple) {
      if (isCurrentlyOpen) {
        newOpenItems = openItems.filter(id => id !== itemId);
      } else {
        newOpenItems = [...openItems, itemId];
      }
    } else {
      newOpenItems = isCurrentlyOpen ? [] : [itemId];
    }

    setOpenItems(newOpenItems);
    onItemToggle?.(itemId, !isCurrentlyOpen);
  };

  const getAccordionClass = () => {
    const classes = [
      'accordion',
      variant === 'flush' ? 'accordion-flush' : '',
      size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getItemClass = (itemId: string) => {
    const isOpen = openItems.includes(itemId);
    const classes = [
      'accordion-item',
      variant === 'bordered' ? 'border' : '',
      isOpen ? 'border-primary' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getHeaderClass = (itemId: string) => {
    const isOpen = openItems.includes(itemId);
    const classes = [
      'accordion-header',
      isOpen ? 'bg-light' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getButtonClass = (itemId: string) => {
    const isOpen = openItems.includes(itemId);
    const classes = [
      'accordion-button',
      isOpen ? '' : 'collapsed',
      size === 'sm' ? 'py-2' : size === 'lg' ? 'py-4' : 'py-3'
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getContentClass = (itemId: string) => {
    const isOpen = openItems.includes(itemId);
    const classes = [
      'accordion-collapse',
      isOpen ? 'show' : 'collapse'
    ];
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className={getAccordionClass()}>
      {items.map((item) => (
        <div key={item.id} className={getItemClass(item.id)}>
          <div className={getHeaderClass(item.id)}>
            <button
              type="button"
              className={getButtonClass(item.id)}
              onClick={() => !item.disabled && handleItemToggle(item.id)}
              disabled={item.disabled}
              aria-expanded={openItems.includes(item.id)}
            >
              <div className="d-flex align-items-center w-100">
                {item.icon && (
                  <Icon name={item.icon as any} className="me-2" size="sm" />
                )}
                <span className="flex-fill text-start">{item.title}</span>
                <Icon 
                  name="chevron-down" 
                  className="ms-2" 
                  size="sm"
                />
              </div>
            </button>
          </div>
          
          <div className={getContentClass(item.id)}>
            <div className="accordion-body">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion; 