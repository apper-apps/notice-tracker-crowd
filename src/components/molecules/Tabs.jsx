import { useState } from "react";
import { cn } from "@/utils/cn";

const Tabs = ({ defaultValue, onValueChange, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex space-x-1 border-b border-gray-200">
        {children.map((child) => {
          if (child.type === TabsList) {
            return {
              ...child,
              props: {
                ...child.props,
                activeTab,
                onTabChange: handleTabChange,
              },
            };
          }
          return child;
        })}
      </div>
      <div className="mt-4">
        {children.find((child) => child.type === TabsContent && child.props.value === activeTab)}
      </div>
    </div>
  );
};

const TabsList = ({ className, children, activeTab, onTabChange }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {children.map((child) => ({
        ...child,
        props: {
          ...child.props,
          isActive: child.props.value === activeTab,
          onClick: () => onTabChange(child.props.value),
        },
      }))}
    </div>
  );
};

const TabsTrigger = ({ className, value, isActive, onClick, children }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
        isActive
          ? "bg-white text-navy-600 border-b-2 border-navy-600"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ className, value, children }) => {
  return (
    <div className={cn("mt-4", className)}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };