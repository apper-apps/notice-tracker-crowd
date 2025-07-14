import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "FileText",
  title = "No data found",
  message = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  className,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)} {...props}>
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;