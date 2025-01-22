import Phaser from "phaser";

import ExitScene from "./scenes/ExitScene";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";

const config = {
  width: 1000,
  height: 600,
};

new Phaser.Game({
  type: Phaser.AUTO, // auto is probably going to be WebGL
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
    new MenuScene(config),
    new ExitScene(config),
    new PlayScene(config),
  ],
  parent: "game-container",
  ...config,
});
