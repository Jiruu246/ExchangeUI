import React, { createContext, useState, ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  defaultTab?: number;
}

interface TabProps {
  title: string;
  children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);

  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  return (
      <div className="w-full">
        <div className="flex justify-around border-b border-gray-200">
          {tabs.map((tab, index) => (
            <div
              key={tab.props.title}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 -mb-px text-sm font-medium cursor-pointer grow
                ${
                  activeTab === index
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.props.title}
            </div>
          ))}
        </div>
        <div className="mt-4">
          {tabs[activeTab]}
        </div>
      </div>
  );
};

const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab };