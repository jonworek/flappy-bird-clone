
import Phaser from "phaser";



/* 
  The preload function is called by Phaser at the start of the game. 
  It is used to load assets like images, audio files, and other resources. 
  In this case, we are loading an image called sky.png.
*/
const preload = function () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('cloud', 'assets/cloud.png');
}

let bird;
let cloud;

const BIRD_VELOCITY = [10, 0];

const birdFlap = function (event) {
  bird.setVelocityY(-100);
}

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
  this.add.image(0, 0, 'sky').setOrigin(0, 0);

  bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird')
    .setOrigin(0)
    .setVelocity(...BIRD_VELOCITY)
    .setGravityY(200);

  cloud = this.physics.add.sprite(config.width / 2, config.height / 3, 'cloud')
    .setOrigin(1)
    .setVelocity(-50, 0)

  console.log(bird.body);

  this.input.on('pointerdown', birdFlap);
  this.input.keyboard.on('keydown-SPACE', birdFlap);
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

  if (cloud.x < 0) {
    cloud.x = config.width;
  }

  if (bird.y > config.height) {
    bird.setVelocity(...BIRD_VELOCITY);
    bird.x = config.width / 10;
    bird.y = config.height / 2;
  }
}

const config = {
  type: Phaser.AUTO,  // auto is probably going to be WebGL
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      //debug: true,
      gravity: {
        //x: -50,
        //y: 200,
      }
    }
  },
  scene: {
    preload,
    create,
    update,
  }
};

new Phaser.Game(config);