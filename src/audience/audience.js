/*
A Few Deep Breaths
CultureHub & LaMaMa ETC, May 2022
*/

let socket;
let mediasoupPeer;

window.onload = () => {
  document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startButton').style.display = 'none';
    init();
  });
};

function init() {
  console.log('~~~~~~~~~~~~~~~~~');

  // hack to prevent issue where we've been scrolled below content...
  window.scrollTo(0, 0);

  if (window.location.hostname === 'venue.itp.io') {
    socket = io('https://venue.itp.io');
  } else {
    socket = io('http://localhost:3131');
  }

  socket.on('sceneIdx', (data) => {
    console.log('SceneIdx:', data);
    setScene(data);
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

  //let isBroadcast = label == document.getElementById('sceneContainer').contentWindow + '-video-broadcast' || label == document.getElementById('sceneContainer').contentWindow + '-audio-broadcast';
  let isBroadcast = true;

  console.log('isBroadcast ' + isBroadcast);

  let el = document.getElementById(id + '_' + label);

  if (isBroadcast) {
    if (isBroadcast && track.kind === 'video') {
      el = document.getElementById('broadcastVideo');
    } else if (isBroadcast && track.kind === 'audio') {
      el = document.getElementById('broadcastAudio');
      el.volume = 1;
    }

    el.srcObject = null;
    el.srcObject = new MediaStream([track]);
  
    el.onloadedmetadata = (e) => {
      el.play().catch((e) => {
        console.log('Play Error: ' + e);
      });
    };
  }



  // Should we even do this?  Probably not
  /*
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
  */
}
