/*
A Few Deep Breaths
CultureHub & LaMaMa ETC, May 2022
*/

let socket;
let mediasoupPeer;

let activeState = {
  chat: false,
  backgroundImage: false,
  backgroundColor: '#000000',
  textPrompt: '',
};

window.onload = () => {
  updateUI();

  document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startButton').style.display = 'none';
    const el = document.getElementById('buttonOverlay');
    el.style.pointerEvents = 'none';
    console.log('changing background of ', el);
    gsap.to(el, {
      duration: 1, // Animation duration (in seconds)
      backgroundColor: '#00000000', // Target color
    });
    init();
  });

  // text input
  document
    .getElementById('textInputSubmitButton')
    .addEventListener('click', (ev) => {
      ev.preventDefault();

      let textInputBox = document.getElementById('textInputBox');
      let text = textInputBox.value;
      console.log('sending text:', text);
      socket.emit('chat', text);
      textInputBox.value = '';
    });
};

function updateUI() {
  if (activeState.chat) {
    document.getElementById('textInput').classList.remove('d-none');
  } else {
    document.getElementById('textInput').classList.add('d-none');
  }
  if (activeState.backgroundImage) {
    document.getElementById('backgroundImage').classList.remove('hidden');
    document.getElementById('backgroundImage').classList.add('visible');
  } else {
    document.getElementById('backgroundImage').classList.add('hidden');
    document.getElementById('backgroundImage').classList.remove('visible');
  }
  if ('textPrompt' in activeState) {
    console.log('updating label text');
    document.getElementById('textPrompt').innerText = activeState.textPrompt;
  }
}

function init() {
  console.log('~~~~~~~~~~~~~~~~~');

  // hack to prevent issue where we've been scrolled below content...
  window.scrollTo(0, 0);

  if (window.location.hostname === 'prometheus.livelab.app') {
    socket = io('https://prometheus.livelab.app');
  } else {
    socket = io('https://localhost');
  }

  socket.on('sceneIdx', (data) => {
    console.log('SceneIdx:', data);
    setScene(data);
  });

  socket.on('stateUpdate', (update) => {
    console.log('received state update: ', update);
    activeState = { ...activeState, ...update };
    console.log('active state:', activeState);
    updateUI();
    // only update if there is a change here
    if (update.backgroundColor) {
      fadeBackgroundToColor(activeState.backgroundColor, 0.25); // bump
    }
  });

  socket.on('colorChange', ({ color, time }) => {
    fadeBackgroundToColor(color, time);
  });

  mediasoupPeer = new SimpleMediasoupPeer(socket);
  mediasoupPeer.on('track', gotTrack);
}

function setScene(data) {
  console.log('switching scene: ', data);
  const myFrame = document.getElementById('sceneContainer');

  myFrame.setAttribute('src', `../scenes/${data}-audience.html`);
  myFrame.style.pointerEvents = 'all';
}

//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//*//

function gotTrack(track, id, label) {
  console.log(`Got track of kind ${label} from ${id}`);

  let isBroadcast = label == 'video-broadcast' || label == 'audio-broadcast';

  let el = document.getElementById(id + '_' + label);

  if (isBroadcast && track.kind === 'video') {
    el = document.getElementById('broadcastVideo');
  }
  if (isBroadcast && track.kind === 'audio') {
    el = document.getElementById('broadcastAudio');
    el.volume = 1;
  }

  if (track.kind === 'video') {
    if (el == null) {
      console.log('Creating video element for client with ID: ' + id);
      el = document.createElement('video');
      el.id = id + '_video';
      el.autoplay = true;
      el.muted = true;
      el.setAttribute('playsinline', true);

      // el.style = "visibility: hidden;";
      document.body.appendChild(el);
    }
  }

  if (track.kind === 'audio') {
    if (el == null) {
      console.log('Creating audio element for client with ID: ' + id);
      el = document.createElement('audio');
      el.id = id + '_' + label;
      document.body.appendChild(el);
      el.setAttribute('playsinline', true);
      el.setAttribute('autoplay', true);
      el.volume = 0;
    }
  }

  el.srcObject = null;
  el.srcObject = new MediaStream([track]);

  el.onloadedmetadata = (e) => {
    el.play().catch((e) => {
      console.log('Play Error: ' + e);
    });
  };
}

//

function fadeBackgroundToColor(newColor, cueDurationInSeconds) {
  const el = document.getElementById('broadcastVideoContainer');
  console.log('changing background of ', el);
  console.log('gsap:', gsap);
  gsap.to('body', {
    duration: cueDurationInSeconds, // Animation duration (in seconds)
    backgroundColor: newColor, // Target color
  });
}

function setBGColor(newColor) {
  fadeBackgroundToColor(newColor, 0);
}

// document.addEventListener('click', () => {
//   fadeBackgroundToColor(`#ff0000`, 10);
//   // setBGColor('pink');
// });
