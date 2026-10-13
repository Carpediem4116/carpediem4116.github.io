// OrbitControls owns right-button input over the canvas. Cancel compatibility
// mouse events so browser mouse-gesture handlers do not also claim the drag.
export function protectViewerInput(canvas) {
  let rightPointer = null;
  const stop = event => {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
  };
  canvas.addEventListener('pointerdown',event => {
    if (event.button !== 2) return;
    rightPointer = event.pointerId;
    stop(event);
  },{passive:false});
  for (const type of ['mousedown','mouseup','mousemove','auxclick','contextmenu']) {
    canvas.addEventListener(type,event => {
      if (event.button === 2 || (event.buttons & 2) || type === 'contextmenu') {
        stop(event);
        event.stopImmediatePropagation();
      }
    },{capture:true,passive:false});
  }
  // OrbitControls installs its move/up listeners on this document. Allow those
  // listeners on the same node to run while containing the drag within it.
  canvas.ownerDocument.addEventListener('pointermove',event => {
    if (event.pointerId === rightPointer) stop(event);
  },{passive:false});
  for (const type of ['pointerup','pointercancel']) {
    canvas.ownerDocument.addEventListener(type,event => {
      if (event.pointerId !== rightPointer) return;
      stop(event);
      rightPointer = null;
    },{passive:false});
  }
  canvas.addEventListener('dragstart',event => event.preventDefault());
  canvas.ownerDocument.defaultView.addEventListener('blur',() => { rightPointer = null; });
}
