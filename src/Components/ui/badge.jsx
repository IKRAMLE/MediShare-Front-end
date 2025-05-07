import { cn } from "../../lib/utils";

const Badge = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
};

export { Badge }; 