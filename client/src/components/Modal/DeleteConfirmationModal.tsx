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
    <Modal onClose={onCancel}>
      <h2 className="text-xl font-semibold mb-4">Delete “{title}”?</h2>
      <p className="mb-6">This action cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <button className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-error" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
