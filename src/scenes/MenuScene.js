import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'MenuScene' });

    this.config = config;
  }

  preload() {
    // Method to load assets
  }

  create() {
    // Set the background color of the scene
    this.cameras.main.setBackgroundColor('#3498db'); // Example color: blue

    const welcomeText = this.add.text(100, 100, 'Welcome to the Game!', {
      font: '32px Arial',
      fill: '#ffffff'
    });

    const startText = this.add.text(100, 200, 'Press "S" to Start', {
      font: '24px Arial',
      fill: '#ffffff'
    });

    this.input.keyboard.on('keydown-S', () => {
      this.scene.start('PlayScene');
    });
  }

  update(time, delta) {
    // Method to update game objects
  }
}

export default MenuScene;