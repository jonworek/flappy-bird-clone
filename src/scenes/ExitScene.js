import Phaser from 'phaser';

class ExitScene extends Phaser.Scene {
  constructor(config) {
    super({ key: 'ExitScene' });

    this.config = config;
  }

  preload() {
    // Method to load assets
  }

  create() {
    // Set the background color of the scene
    this.cameras.main.setBackgroundColor('#000000'); // Black background

    const exitText = this.add.text(this.config.width / 2, this.config.height / 2, 'Are you sure you want to exit?', {
      font: '32px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const additionalText = this.add.text(exitText.x, exitText.y + 50, 'Press Y to confirm, N to cancel', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-Y', () => {
      this.game.destroy(true);
    });

    this.input.keyboard.on('keydown-N', () => {
      this.scene.start('PlayScene');
    });
  }

  update(time, delta) {
    // Method to update game objects
  }
}

export default ExitScene;