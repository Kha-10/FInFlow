import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastViewport,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function CustomToaster() {
  const { toasts } = useToast();
  console.log(toasts);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`
              animate-fade-left
             bg-white dark:bg-gray-900
            `}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {props.variant === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {props.variant === "error" && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {!props.variant && (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                )}
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="top-0 right-0 flex-col gap-2 p-4" />
    </ToastProvider>
  );
}
