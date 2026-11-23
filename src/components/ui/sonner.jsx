import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      richColors
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-neutral-950 border border-neutral-200 shadow-xl rounded-xl",
          description: "text-neutral-600",
          actionButton: "bg-neutral-900 text-white",
          cancelButton: "bg-neutral-100 text-neutral-700",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
