import * as React from "react";

// Card component
const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
});
Card.displayName = "Card";

// CardHeader component
const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

// CardTitle component
const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

// CardDescription component
const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

// CardContent component
const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  );
});
CardContent.displayName = "CardContent";

// CardFooter component
const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
