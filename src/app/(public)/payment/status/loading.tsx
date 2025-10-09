import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto text-center space-y-6">
        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
        <h1 className="text-3xl font-bold">Processing Payment</h1>
        <p className="text-muted-foreground">
          Please wait while we process your payment...
        </p>
      </div>
    </div>
  );
}
