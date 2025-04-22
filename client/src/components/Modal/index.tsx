import { createPortal } from "react-dom";
import { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose(): void;
  "data-testid"?: string;
}

export function Modal({
  children,
  onClose,
  "data-testid": testId,
  ...rest
}: ModalProps) {
  return createPortal(
    <div className="modal modal-open" data-testid={testId} {...rest}>
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
