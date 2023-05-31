/*
A Few Deep Breaths
CultureHub & LaMaMa ETC, May 2022
*/

let socket;

function init() {
  console.log('~~~~~~~~~~~~~~~~~');

  // hack to prevent issue where we've been scrolled below content...
  window.scrollTo(0, 0);

  if (window.location.hostname === 'prometheus.livelab.app') {
    socket = io('https://prometheus.livelab.app');
  } else {
    socket = io('https://localhost');
  }

  socket.on('chat', (text) => {
    console.log('got text', text);
    let t = '';
    text.data.forEach((doc) => {
      t += doc.text;
      t += '\n\n\n';
    });
    document.getElementById('textContainer').innerText = t;
  });
}

init();
