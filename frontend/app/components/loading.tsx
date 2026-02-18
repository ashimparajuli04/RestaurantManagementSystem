import { Coffee } from "lucide-react";
import { useEffect, useState } from "react";

type LoadingViewProps = {
  label?: string;
};

export function LoadingView({ label = "" }: LoadingViewProps) {
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNote(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Coffee className="h-10 w-10 mx-auto text-stone-800 animate-pulse" />
        <p className="text-stone-600">
          Loading {label && `${label} `}...
        </p>

        {showNote && (
          <p className="text-sm text-stone-500 max-w-xs mx-auto">
            Sorry for the delay — the app is hosted on a free tier, which may take a moment to wake up.
          </p>
        )}
      </div>
    </div>
  );
}
