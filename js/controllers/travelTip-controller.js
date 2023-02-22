window.onFormSubmit = onFormSubmit;

function onFormSubmit(ev) {
  console.log('ev: ', ev);
  if (ev) ev.preventDefault();
}
