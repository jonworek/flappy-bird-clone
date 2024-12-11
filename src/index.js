
import Phaser from "phaser";



/* 
  The preload function is called by Phaser at the start of the game. 
  It is used to load assets like images, audio files, and other resources. 
  In this case, we are loading an image called sky.png.
*/
const preload = function() {
  this.load.image('sky', 'assets/sky.png');
}

/*
  The create function is called by Phaser after the preload function. 
  It is used to create game objects like sprites, text, and shapes. 
  In this case, we are creating a sprite with the sky image.
*/
const create = function() {
  this.add.image(400, 300, 'sky');
}

const update = function() {
  // TODO
}

const config = {
  type: Phaser.AUTO,  // auto is probably going to be WebGL
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload,
    create,
    //update,
  }
};

new Phaser.Game(config);