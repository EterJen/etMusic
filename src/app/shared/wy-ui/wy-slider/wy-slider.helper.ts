export function prohibitBubbling(e: Event): void {
  e.stopPropagation();
  e.preventDefault();
}

export function getElementOffset(el: HTMLElement): { top: number, left: number } {
  const badRes = {
    top: 0,
    left: 0
  };

  if (!el.getClientRects().length) {
    return badRes;
  }

  const rect = el.getBoundingClientRect();
  const defaultView = el.ownerDocument.defaultView;

  if (defaultView) {
    return {
      top: rect.top + defaultView.pageYOffset,
      left: rect.left + defaultView.pageXOffset
    };
  } else {
    return badRes;
  }
}

