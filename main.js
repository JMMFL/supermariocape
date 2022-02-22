import { screens, storyboard } from './modules/scenes.js';
import playerControls from './modules/controller.js';
import { Mario } from './modules/elements.js';
import { loading } from './modules/load.js';

const startBtn = document.getElementById('screen-intro__start-btn');
const soundBtn = document.getElementById('screen-intro__sound-btn');
const CANVAS = document.getElementById('canvas');
const CANVAS_WIDTH = CANVAS.width;
const CANVAS_HEIGHT = CANVAS.height;
const CANVAS_MID_X = CANVAS_WIDTH / 2;
const CANVAS_MID_Y = CANVAS_HEIGHT / 2;
const ctx = canvas.getContext('2d');

const game = {
  state: 'START',
  isOn: false,
  scrollSpeed: 6,
  livesStart: 3,
  lives: 3,
  level: 0,
  timeouts: [],
  hasSound: false,

  music: {
    title: new Audio('audio/music/title.mp3'),
    yoshisIsland: new Audio('audio/music/yoshis-island.mp3'),
  },

  sfx: {
    lostALife: new Audio('audio/sfx/lost-a-life.wav'),
    irisOut: new Audio('audio/sfx/iris-out.wav'),
    capeJump: new Audio('audio/sfx/cape-jump.wav'),
    courseClear: new Audio('audio/sfx/course-clear.wav'),
    fortressClear: new Audio('audio/sfx/fortress-clear.wav'),
    messageBlock: new Audio('audio/sfx/message-block.wav'),
    gameOver: new Audio('audio/sfx/game-over.wav'),
  },
};

const controller = {
  LEFT_KEY: 37,
  RIGHT_KEY: 39,
  UP_1_KEY: 38,
  UP_2_KEY: 32,
  DOWN_KEY: 40,
  pressedLeft: false,
  pressedRight: false,
  pressedUp: false,
  pressedDown: false,

  reset() {
    this.pressedLeft = false;
    this.pressedRight = false;
    this.pressedUp = false;
    this.pressedDown = false;
  },
};

const player = new Mario();
const elements = [];
elements.update = () => elements.forEach((e) => e.update());
elements.move = () => elements.forEach((e) => e.move());

let fpsInterval = 1000 / 60;
let then = Date.now();
let elapsed, now;

function runGame() {
  requestAnimationFrame(runGame);
  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    drawBackground();
    player.move();
    elements.update();
    player.update();
    if (game.isOn) elements.move();

    // if (player.isDead) storyboard.showDeathScene();
    if (player.passedTutorial && game.state === 'TUTORIAL')
      storyboard.showSceneMap();
    if (player.gotStar) passScene();
  }
}

function drawBackground() {
  if (
    game.isOn ||
    game.state === 'START' ||
    game.state === 'END' ||
    game.state === 'TUTORIAL'
  ) {
    let currentPos = parseInt(screens.background.backgroundPositionX);

    screens.background.backgroundPositionX = `${
      currentPos - game.scrollSpeed
    }px`;
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function menuControls(event) {
  if (game.isOn) return;

  let { keyCode, type } = event;
  let { UP_1_KEY, UP_2_KEY } = controller;
  let menuClicked = type === 'click';
  let menuPressed = keyCode === UP_1_KEY || keyCode === UP_2_KEY;

  if (menuClicked || menuPressed) {
    switch (game.state) {
      case 'START':
        storyboard.showSceneTutorial();
        break;
      case 'RETRY':
        // hideScreen(screens.retry);
        // game.lives--;
        //levelScene();
        break;
      case 'OVER':
        // hideScreen(screens.failure);
        // game.lives = game.livesStart;
        // game.level = 0;
        // levelScene();
        break;
      default:
        break;
    }
  }
}

function setGame() {
  let interval = setInterval(() => {
    if (loading.length === 0) {
      setAudio();
      setControls();
      storyboard.showSceneIntro();
      runGame();
      clearInterval(interval);
    }
  }, 250);
}

function setAudio() {
  soundBtn.addEventListener('click', () => {
    let { hasSound } = game;
    game.hasSound = !hasSound;
    game.music.title[hasSound ? 'pause' : 'play']();
    soundBtn.value = `Sound: ${hasSound ? 'Off' : 'On!'}`;
  });
}

function setControls() {
  startBtn.addEventListener('click', menuControls);
  // document.addEventListener('keydown', menuControls);
  document.addEventListener('keydown', playerControls);
  document.addEventListener('keyup', playerControls);
}

window.addEventListener('load', setGame);

export { LEVELS, Level } from './modules/levels.js';
export * as Elements from './modules/elements.js';
export {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_MID_X,
  CANVAS_MID_Y,
  ctx,
  game,
  controller,
  player,
  elements,
  fpsInterval,
};
