import { X } from "lucide-react";
import React from "react";

interface TagBadgeProps {
  tag: string;
  onRemove(tag: string): void;
}

export const TagBadge = React.memo<TagBadgeProps>(({ tag, onRemove }) => (
  <button
    type="button"
    className="badge badge-primary badge-sm inline-flex items-center gap-1 btn btn-ghost p-3"
    onClick={() => onRemove(tag)}
    aria-label={`Remove ${tag}`}
  >
    <span>{tag}</span>
    <X size={12} />
  </button>
));
