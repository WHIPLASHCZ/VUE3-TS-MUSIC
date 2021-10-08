export function addClass(
  el: HTMLElement,
  className: string,
  bool: boolean = true
) {
  if (bool) {
    el.classList.add(className);
    // el.className += ` ${className}`;
    // alert(el.classList);
  } else {
    el.classList.remove(className);
  }
}

export function findParentByClassName(
  dom: HTMLElement,
  parentClassName: string
): HTMLElement | null {
  if (!dom) return null;
  if ((dom.parentNode as HTMLElement)!.classList.contains(parentClassName)) {
    let res = dom.parentNode;
    return res as HTMLElement;
  } else {
    return findParentByClassName(
      (dom.parentNode as HTMLElement)!,
      parentClassName
    );
  }
}
