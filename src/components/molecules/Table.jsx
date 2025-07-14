import { cn } from "@/utils/cn";

const Table = ({ className, ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full caption-bottom text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
};

const TableHeader = ({ className, ...props }) => {
  return (
    <thead
      className={cn(
        "border-b bg-surface",
        className
      )}
      {...props}
    />
  );
};

const TableBody = ({ className, ...props }) => {
  return (
    <tbody
      className={cn(
        "divide-y divide-gray-200",
        className
      )}
      {...props}
    />
  );
};

const TableRow = ({ className, ...props }) => {
  return (
    <tr
      className={cn(
        "hover:bg-gray-50 transition-colors",
        className
      )}
      {...props}
    />
  );
};

const TableHead = ({ className, ...props }) => {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
};

const TableCell = ({ className, ...props }) => {
  return (
    <td
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
        className
      )}
      {...props}
    />
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };