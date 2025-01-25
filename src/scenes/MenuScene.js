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
    }).setInteractive().on('pointerdown', () => {
      this.scene.start('PlayScene');
    }).on('pointerover', () => {
      startText.setStyle({ fill: '#ff0' });
    }).on('pointerout', () => {
      startText.setStyle({ fill: '#fff' });
    });

    const exitText = this.add.text(100, 300, 'Press "E" to Exit', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setInteractive().on('pointerdown', () => {
      this.scene.start('ExitScene');
    }).on('pointerover', () => {
      exitText.setStyle({ fill: '#ff0' });
    }).on('pointerout', () => {
      exitText.setStyle({ fill: '#fff' });
    });

    this.input.keyboard.on('keydown-S', () => {
      this.scene.start('PlayScene');
    });

    this.input.keyboard.on('keydown-E', () => {
      this.scene.start('ExitScene');
    });

    this.input.gamepad.on('connected', (pad) => {
      console.log(`Gamepad connected: ${pad.id}`);
    });

    this.input.gamepad.on('down', (gamepad, button, value) => {
      switch (button.index) {
        case 9: // Start button
          this.scene.start('PlayScene');
          break;
        default:
          break;
      }
    });
  }

  update(time, delta) {
    // Method to update game objects
  }
}

export default MenuScene;