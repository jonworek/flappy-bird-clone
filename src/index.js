import Phaser from "phaser";

/* 
  The preload function is called by Phaser at the start of the game. 
  It is used to load assets like images, audio files, and other resources. 
  In this case, we are loading an image called sky.png.
*/
const preload = function () {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("cloud", "assets/cloud.png");
  this.load.image("pipe", "assets/pipe.png");
};

let bird;
let cloud, cloud2;
let pipes;

const BIRD_VELOCITY = [0, 0];

const birdFlap = function (event) {
  bird.setVelocityY(-150);
};

//window.addEventListener('keydown', function (event) {
//  if (event.code === 'Space') {
//    console.log('space key pressed');
//    event.preventDefault();
//  }
//});

/*
  The create function is called by Phaser after the preload function. 
  It is used to create game objects like sprites, text, and shapes. 
  In this case, we are creating a sprite with the sky image.
*/
const create = function () {
  this.add.image(0, 0, "sky").setOrigin(0, 0);

  cloud = this.physics.add
    .sprite(config.width / 2, 0, "cloud")
    .setOrigin(0)
    .setVelocity(-30, 0);

  cloud2 = this.physics.add
    .sprite(config.width / 1.1, 100, "cloud")
    .setOrigin(0)
    .setVelocity(-25, 0);

  pipes = this.physics.add.group();

  // rightmost pipes
  pipes.create(config.width * .99, -220, "pipe");  // top
  pipes.create(config.width * .99, 450, "pipe");   // bottom

  // middle pipes
  pipes.create(config.width * .66, -200, "pipe");  // top
  pipes.create(config.width * .66, 450, "pipe");   // bottom

  // leftmost pipes
  pipes.create(config.width * .33, -100, "pipe");  // top
  pipes.create(config.width * .33, 550, "pipe");   // bottom

  pipes.setVelocityX(-50);

  bird = this.physics.add
    .sprite(config.width / 10, config.height / 2, "bird")
    .setOrigin(0)
    .setVelocity(...BIRD_VELOCITY)
    .setGravityY(200);

  console.log(bird.body);

  this.input.on("pointerdown", birdFlap);
  this.input.keyboard.on("keydown-SPACE", birdFlap);
};

const redrawPipes = function (offscreenPipes) {
  let top, bottom;
  let gapSize = Phaser.Math.Between(150, 250);
  let gapMidpoint = Phaser.Math.Between(120, 480);

  if (offscreenPipes[0].y > offscreenPipes[1].y) {
    top = offscreenPipes[0];
    bottom = offscreenPipes[1];
  } else {
    top = offscreenPipes[1];
    bottom = offscreenPipes[0];
  }

  // reset to right of the screen
  top.x = config.width;
  bottom.x = config.width;

  // pipes are 480px tall, and if the origin is in the center of the sprite,
  // then there is 240px above and below the origin which means both y positions
  // must be between -239px and 839px to be on screen
  // but we'll limit it to -220px and 820px so there's an least 20px of pipe onscreen

  // Set the y position based on the gap
  top.y = gapMidpoint - gapSize / 2 - top.height / 2;
  bottom.y = gapMidpoint + gapSize / 2 + bottom.height / 2;
}

/*
  The update function is called by Phaser at the start of every frame. 
  It is used to update game objects like sprites, text, and shapes. 
  In this case, we are updating the position of the bird sprite.
*/
const update = function (time, delta) {
  //console.log(time, delta);

  if (bird.x > config.width) {
    // reset the bird's position to the top of the screen
    bird.x = config.width / 10;
    bird.y = config.height / 2;

    // reset the bird's velocity
    bird.setVelocity(...BIRD_VELOCITY);
  }

  if (cloud.x + cloud.width < 0) {
    cloud.x = config.width;
  }

  if (cloud2.x + cloud2.width < 0) {
    cloud2.x = config.width;
  }

  let offscreenPipes = [];

  // reset the pipe's position to the right of the screen
  // if they move off the left side
  pipes.children.iterate(function (pipe) {
    if (pipe.x + pipe.width < 0) {
      offscreenPipes.push(pipe);
    }
  });

  // the pipes are offscreen, so we can reset them to the rightmost x position,
  // and a random y position
  if (offscreenPipes.length === 2) {
    redrawPipes(offscreenPipes);
  }

  if (bird.y > config.height) {
    bird.setVelocity(...BIRD_VELOCITY);
    bird.x = config.width / 10;
    bird.y = config.height / 2;
  }
};

const config = {
  type: Phaser.AUTO, // auto is probably going to be WebGL
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        //x: -50,
        //y: 200,
      },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);
