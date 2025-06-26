import { Loader2 } from "lucide-react";

export default function ButtonContent({
  loading,
  loadingString,
  defaultString,
}: {
  loading: boolean;
  loadingString: string;
  defaultString: string;
}) {
  if (loading) {
    return (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        {loadingString}...
      </>
    );
  }

  return <>{defaultString}</>;
}
