let socket;
// let numScenes = 6;

// let sceneSwitcherButtons = {};

let activeState = {
  chat: false,
  backgroundImage: false,
};

function setup() {
  console.log('Setting up socket connection');

  if (window.location.hostname === 'prometheus.livelab.app') {
    socket = io('https://prometheus.livelab.app');
  } else {
    socket = io('https://localhost');
  }

  // toggle chat
  let chatButton = document.getElementById('chatButton');
  const updateChatButton = () => {
    chatButton.style.backgroundColor = activeState.chat ? 'red' : 'white';
    chatButton.style.color = activeState.chat ? 'white' : 'black';

    chatButton.innerText = activeState.chat
      ? 'Hide Text Input'
      : 'Show Text Input';
  };
  chatButton.addEventListener('click', () => {
    socket.emit('stateUpdate', { chat: !activeState.chat });
  });

  document.getElementById('clearChat').addEventListener('click', () => {
    socket.emit('clearChat');
  });

  // set BG image
  let bgButton = document.getElementById('bgButton');
  const updateBGButton = () => {
    bgButton.style.backgroundColor = activeState.backgroundImage
      ? 'red'
      : 'white';
    bgButton.style.color = activeState.backgroundImage ? 'white' : 'black';

    bgButton.innerText = activeState.backgroundImage
      ? 'Hide Background'
      : 'Show Background';
  };
  bgButton.addEventListener('click', () => {
    updateBGButton();
    socket.emit('stateUpdate', {
      backgroundImage: !activeState.backgroundImage,
    });
  });
  // updateBGButton();

  // set BG color
  let colorChangeButton = document.getElementById('colorChangeButton');
  colorChangeButton.addEventListener('click', () => {
    let color = document.getElementById('colorInput').value;
    let time = document.getElementById('transitionTimeInput').value;
    console.log('transition to color', color, ' over ', time, 'seconds');
    socket.emit('colorChange', {
      color,
      time,
    });
  });

  let textPromptButton = document.getElementById('textPromptButton');
  textPromptButton.addEventListener('click', () => {
    let text = document.getElementById('textPromptInput').value;
    // console.log('u to color', color, ' over ', time, 'seconds');
    socket.emit('stateUpdate', {
      textPrompt: text,
    });
  });
  let adminTextButton = document.getElementById('adminTextButton');
  adminTextButton.addEventListener('click', () => {
    let text = document.getElementById('adminTextInput').value;
    // console.log('u to color', color, ' over ', time, 'seconds');
    socket.emit('stateUpdate', {
      adminText: text,
    });
  });

  function updateTextBoxes() {
    document.getElementById('currTextPrompt').innerText =
      activeState.textPrompt;
    document.getElementById('currAdminText').innerText = activeState.adminText;
  }
  // all updates
  const updateUI = () => {
    updateChatButton();
    updateBGButton();
    updateTextBoxes();
    document.getElementById('currBGColor').style.backgroundColor =
      activeState.backgroundColor;
  };

  // update state from server
  socket.on('stateUpdate', (update) => {
    console.log('received state update: ', update);
    activeState = { ...activeState, ...update };
    updateUI();
  });

  socket.on('colorChange', ({ color, time }) => {
    activeState.backgroundColor = color;
    document.getElementById('currBGColor').style.backgroundColor =
      activeState.backgroundColor;
  });

  // document.getElementById('sendAdminMessage').addEventListener('click', () => {
  //   let message = document.getElementById('adminMessageInput').value;
  //   console.log('sending admin message:', message);
  //   let data = {
  //     msg: message,
  //   };
  //   socket.emit('adminMessage', data);
  // });

  // setup scene selection logic
  // let sceneSelect = document.getElementById('sceneSelect');
  // for (let i = 0; i < availableScenes.length; i++) {
  //   let sceneName = availableScenes[i];
  //   const option = document.createElement('option');
  //   option.innerText = sceneName;
  //   sceneSelect.appendChild(option);
  // }
  // let sceneGoButton = document.getElementById('sceneGoButton');
  // sceneGoButton.addEventListener('click', () => {
  //   console.log('go to new scene');
  //   console.log(sceneSelect.value);
  //   socket.emit('sceneIdx', sceneSelect.value);
  // });

  // socket.on('sceneIdx', (data) => {
  //   console.log('Current scene from server: ', data);
  //   sceneSelect.value = data;

  // TODO make this work
  // sceneSelect.
  // for (let id in sceneSwitcherButtons) {
  //   sceneSwitcherButtons[id].classList.remove('activeButton');
  // }
  // if (sceneSwitcherButtons[data]) {
  //   sceneSwitcherButtons[data].classList.add('activeButton');
  // }
  // });

  // let lobbyButton = document.getElementById('activateLobbyButton');
  // lobbyButton.addEventListener('click', () => {
  //   socket.emit('sceneIdx', 1);
  // });
  // sceneSwitcherButtons[1] = lobbyButton;

  // let showButton = document.getElementById('activateShowButton');
  // showButton.addEventListener('click', () => {
  //   socket.emit('sceneIdx', 2);
  // });
  // sceneSwitcherButtons[2] = showButton;

  // let showChatButton = document.getElementById('showChatButton');
  // showChatButton.addEventListener('click', () => {
  //   socket.emit('showChat', true);
  // });
  // let hideChatButton = document.getElementById('hideChatButton');
  // hideChatButton.addEventListener('click', () => {
  //   socket.emit('showChat', false);
  // });
}

setup();
