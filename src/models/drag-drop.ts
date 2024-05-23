// Drag and Drop Interface
export interface Dragable {
  drageStartHandler(event: DragEvent): void;
  drageEndHandler(event: DragEvent): void;
}

export interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
