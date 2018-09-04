var iter = document
  .querySelectorAll(".blind_label._audio_row__play_btn")
  .values();

var timer = setInterval(_ => {
  let x = iter.next();
  if (x.done) {
    clearInterval(timer);
  } else {
    x.value.dispatchEvent(new Event("click"));
  }
}, 500);
