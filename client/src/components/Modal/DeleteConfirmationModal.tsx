import { Modal } from "./index";

interface DeleteConfirmationModalProps {
  title: string;
  onConfirm(): void;
  onCancel(): void;
}

export function DeleteConfirmationModal({
  title,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <Modal onClose={onCancel} data-testid="confirm-dialog">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="mb-6">This action cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <button
          data-testid="cancel-delete"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          data-testid="confirm-delete"
          className="btn btn-error"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
