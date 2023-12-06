console.log("hello, world!");



function note(ctx, frequency) {
  console.log(`create note with frequency ${frequency}`);
  const o = new OscillatorNode(ctx, {
    frequency,
  });
  o.connect(ctx.destination);
  return o;
}


  const ctx = new AudioContext();
  const notes = {
    a:  note(ctx, 440),
    b:  note(ctx, 495),
    cs: note(ctx, 557),
    e:  note(ctx, 660),
    fs: note(ctx, 743),
    aa: note(ctx, 880),
  };


window.onload = () => {
  window.onkeydown = () => {
    ctx.resume();
    notes.a.start();
    window.onkeydown = undefined;
  };
};
