import React from "react";

interface SelectModeToggleProps {
  selectionMode: boolean;
  onToggleMode(): void;
  selectedCount: number;
  onBulkDelete(): void;
  bulkDeleteDisabled: boolean;
}

export const SelectModeToggle: React.FC<SelectModeToggleProps> = ({
  selectionMode,
  onToggleMode,
  selectedCount,
  onBulkDelete,
  bulkDeleteDisabled,
}) => (
  <div
    role="toolbar"
    aria-label="Selection mode controls"
    className="flex items-center space-x-2 ml-auto"
  >
    <button
      aria-pressed={selectionMode}
      onClick={onToggleMode}
      className="btn btn-primary btn-sm"
      data-testid="select-mode-toggle"
    >
      {selectionMode ? "Exit Select" : "Multi Select"}
    </button>

    {selectionMode && (
      <button
        onClick={onBulkDelete}
        disabled={bulkDeleteDisabled}
        className="btn btn-sm btn-error"
        data-testid="bulk-delete-button"
      >
        Delete {selectedCount}
      </button>
    )}
  </div>
);
