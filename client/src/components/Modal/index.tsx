// client/src/components/Modal/index.tsx
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose(): void;
}) {
  return createPortal(
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
