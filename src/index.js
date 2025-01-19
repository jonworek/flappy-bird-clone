import Phaser from "phaser";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";

const dimensions = {
  width: 800,
  height: 600,
};

const config = {
  type: Phaser.AUTO, // auto is probably going to be WebGL
  ...dimensions,
  physics: {
    default: "arcade",
    arcade: {
      //debug: true,
      gravity: {
        //x: -50,
        //y: 200,
      },
    },
  },
  scene: [
    new MenuScene(dimensions),
    new PlayScene(dimensions),
  ],
};

new Phaser.Game(config);
