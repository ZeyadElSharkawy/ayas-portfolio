// Tiny store for the needle cursor's label. DOM elements can use a `data-cursor="Label"` attribute instead;
// this is for things the DOM can't see, like hovered meshes in the 3D scene.

let label: string | null = null;
const listeners = new Set<() => void>();

export function setCursorLabel(next: string | null) {
  if (next === label) return;
  label = next;
  listeners.forEach((l) => l());
}

export const getCursorLabel = () => label;

export function subscribeCursorLabel(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
