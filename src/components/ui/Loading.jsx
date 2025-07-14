import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5, ...props }) => {
  return (
    <div className={cn("animate-pulse", className)} {...props}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="bg-gray-200 rounded-md h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 rounded h-4 w-3/4"></div>
              <div className="bg-gray-200 rounded h-4 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;