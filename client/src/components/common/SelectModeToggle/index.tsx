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
  <fieldset className="fieldset">
    <legend className="fieldset-legend text-sm">Multi-Delete Mode</legend>
    <div className="flex gap-2">
      <button
        className="btn btn-sm"
        data-testid="select-mode-toggle"
        onClick={onToggleMode}
      >
        {selectionMode ? "Exit Select" : "Select"}
      </button>
      {selectionMode && (
        <button
          className="btn btn-sm btn-error"
          data-testid="bulk-delete-button"
          disabled={bulkDeleteDisabled}
          onClick={onBulkDelete}
        >
          Delete {selectedCount}
        </button>
      )}
    </div>
  </fieldset>
);
