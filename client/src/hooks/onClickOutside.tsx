import { RefObject, useEffect } from "react";

type EventType = MouseEvent | TouchEvent;

/**
 * Hook that detects clicks outside of the specified element
 * @param ref - Reference to the element to detect clicks outside of
 * @param handler - Callback function to run when a click outside is detected
 */
function onClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: EventType) => void
): void {
  useEffect(() => {
    const listener = (event: EventType): void => {
      // Special case for menu button to prevent duplicate handling
      if ((event.target as HTMLElement).closest?.(".fimenu")) return;

      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener as EventListener);
    document.addEventListener("touchstart", listener as EventListener);

    return () => {
      document.removeEventListener("mousedown", listener as EventListener);
      document.removeEventListener("touchstart", listener as EventListener);
    };
  }, [ref, handler]);
}

export default onClickOutside;
