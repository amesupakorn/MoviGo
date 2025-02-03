"use client";
import { useAlert } from "@/app/context/AlertContext";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react"
import { useEffect } from "react";
import { X } from "lucide-react";

const GlobalAlert = () => {
  const { error, setError, success, setSuccess } = useAlert();


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000); 
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000); 
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  if (!error && !success) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
      {error && (
        <Alert variant="destructive" className="relative max-w-md">
          <AlertCircle className="h-4 w-4" />
          <button onClick={() => setError(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="relative max-w-md">
          <AlertCircle className="h-4 w-4" />
          <button onClick={() => setSuccess(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <X size={18} /> 
          </button>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default GlobalAlert;
