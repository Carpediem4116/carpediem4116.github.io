// Listen only on the model canvas so joint inputs and page shortcuts retain
// their own keys. Public OrbitControls methods enforce its distance limits.
export function enableViewerKeyboard(canvas,controls,{ready,fit}) {
  canvas.addEventListener('pointerdown',() => canvas.focus({preventScroll:true}));
  canvas.addEventListener('keydown',event => {
    if (!ready() || event.altKey || event.ctrlKey || event.metaKey) return;
    const rotation = Math.PI / 30;
    const arrows = {ArrowLeft:[1,0],ArrowRight:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
    const direction = arrows[event.key];
    if (direction) {
      if (event.shiftKey) controls.pan(direction[0] * 12,direction[1] * 12);
      else if (direction[0]) controls.rotateLeft(direction[0] * rotation);
      else controls.rotateUp(direction[1] * rotation);
    } else if (event.key === '+' || event.key === '=') controls.dollyIn(.9);
    else if (event.key === '-' || event.key === '_') controls.dollyOut(.9);
    else if (event.key.toLowerCase() === 'f') fit();
    else return;
    event.preventDefault();
  });
}
