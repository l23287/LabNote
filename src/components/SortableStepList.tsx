import { useState } from "react";
import type { KeyboardEvent } from "react";
import { GripVertical, Plus, X } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({
  id,
  index,
  text,
  onRemove,
}: {
  id: string;
  index: number;
  text: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-3 py-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-2 touch-none cursor-grab active:cursor-grabbing shrink-0"
        aria-label="Schritt verschieben"
      >
        <GripVertical size={18} />
      </button>
      <span className="w-6 h-6 rounded-full bg-bg-soft text-xs flex items-center justify-center text-muted font-semibold shrink-0">
        {index + 1}
      </span>
      <span className="flex-1 text-sm">{text}</span>
      <button onClick={onRemove} type="button" className="text-muted-2 shrink-0" aria-label="Entfernen">
        <X size={16} />
      </button>
    </div>
  );
}

export function SortableStepList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );
  const ids = items.map((_, i) => `step-${i}`);

  function add() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setValue("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    onChange(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
        />
        <button
          onClick={add}
          type="button"
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          }}
        >
          <Plus className="text-white" />
        </button>
      </div>

      {items.length > 0 && (
        <>
          <p className="text-xs text-muted-2 -mt-1">
            Halte einen Schritt gedrückt und ziehe ihn, um die Reihenfolge zu ändern.
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                  <SortableRow key={ids[i]} id={ids[i]} index={i} text={item} onRemove={() => remove(i)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
