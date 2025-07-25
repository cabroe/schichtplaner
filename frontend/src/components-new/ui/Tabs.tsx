import React, { useState } from 'react';
import { Icon } from './Icon';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onTabChange?: (tabId: string) => void;
  vertical?: boolean;
  fullWidth?: boolean;
}

/**
 * Tab-Navigation-Komponente
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  variant = 'default',
  size = 'md',
  className = '',
  onTabChange,
  vertical = false,
  fullWidth = false
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getTabListClass = () => {
    const classes = [
      'nav',
      variant === 'pills' ? 'nav-pills' : variant === 'underline' ? 'nav-tabs' : 'nav-tabs',
      size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '',
      fullWidth ? 'nav-fill' : '',
      vertical ? 'flex-column' : '',
      className
    ];
    return classes.filter(Boolean).join(' ');
  };

  const getTabClass = (tabId: string) => {
    const isActive = activeTab === tabId;
    const isDisabled = tabs.find(tab => tab.id === tabId)?.disabled;
    
    const classes = [
      'nav-link',
      isActive ? 'active' : '',
      isDisabled ? 'disabled' : '',
      variant === 'underline' && isActive ? 'border-bottom-0' : ''
    ];
    return classes.filter(Boolean).join(' ');
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={vertical ? 'd-flex' : ''}>
      <ul className={getTabListClass()}>
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              type="button"
              className={getTabClass(tab.id)}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
            >
              <div className="d-flex align-items-center">
                {tab.icon && (
                  <Icon name={tab.icon as any} className="me-2" size="sm" />
                )}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="badge bg-primary ms-2">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="tab-content mt-3">
        <div className="tab-pane active">
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};

export default Tabs; 