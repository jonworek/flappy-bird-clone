import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  bird;
  cloud;
  cloud2;
  config;
  pipes;

  BIRD_VELOCITY = [0, 0];

  constructor(config) {
    super({ key: "PlayScene" });
    this.config = config;
  }

  /* 
    The preload function is called by Phaser at the start of the game. 
    It is used to load assets like images, audio files, and other resources. 
    In this case, we are loading an image called sky.png.
  */
  preload = function () {
    this.load.image("sky", "assets/sky.png");
    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause-button", "assets/pause.png");
  };

  /*
    The create function is called by Phaser after the preload function. 
    It is used to create game objects like sprites, text, and shapes. 
    In this case, we are creating a sprite with the sky image.
  */
  create = function () {
    // sky background
    this.add.graphics()
      .fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFFFFF, 0xFFFFFF, 1)
      .fillRect(0, 0, this.config.width, this.config.height);

    // clouds
    this.cloud = this.physics.add
      .sprite(this.config.width / 2, 0, "cloud")
      .setOrigin(0)
      .setVelocity(-30, 0);

    this.cloud2 = this.physics.add
      .sprite(this.config.width / 1.1, 100, "cloud")
      .setOrigin(0)
      .setVelocity(-25, 0);

    this.createPipes();

    // bird
    this.bird = this.physics.add
      .sprite(this.config.width / 10, this.config.height / 2, "bird")
      .setOrigin(0)
      .setFlipX(true)
      .setVelocity(...this.BIRD_VELOCITY)
      .setGravityY(200)
      .setScale(3)
      .setCollideWorldBounds(true);

    this.bird.body.setSize(16, 9);

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 8,  // 8 frames per second
      repeat: -1, // repeat forever
    });

    this.bird.anims.play("fly");

    // collision detection
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);

    // score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
      fontWeight: "bold",
    });

    this.createPauseButton();
    this.createInputListeners();
  };

  createPipes = function () {
    // pipes
    this.pipes = this.physics.add.group();

    // rightmost pipes
    this.pipes.create(this.config.width * 0.99, -220, "pipe"); // top
    this.pipes.create(this.config.width * 0.99, 450, "pipe"); // bottom

    // middle pipes
    this.pipes.create(this.config.width * 0.66, -200, "pipe"); // top
    this.pipes.create(this.config.width * 0.66, 450, "pipe"); // bottom

    // leftmost pipes
    this.pipes.create(this.config.width * .33, -100, "pipe");  // top
    this.pipes.create(this.config.width * .33, 550, "pipe");   // bottom

    this.pipes.children.iterate(function (pipe) {
      pipe.setImmovable(true);
    });

    this.pipes.setVelocityX(-150);
  };

  createPauseButton = function () {
    this.pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause-button")
      .setOrigin(1)
      .setScale(3)
      .setInteractive();

    this.pauseButton.on("pointerdown", () => {
      this.scene.pause();
      this.physics.pause();
    })
  }

  createInputListeners = function () {
    // input events
    this.input.on("pointerdown", () => {
      this.birdFlap();
    })
    this.input.keyboard.on("keydown-SPACE", () => {
      this.birdFlap()
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.start("MenuScene");
    })

    this.input.gamepad.on("down", (gamepad, button, value) => {
      switch (button.index) {
        case 0: // A button (Xbox controller) / Cross button (PlayStation controller)
          this.birdFlap();
          break;
        case 9: // Start button
          this.scene.start("ExitScene");
          break;
        default:
          break;
      }
    });
  }

  gameOver = function () {
    this.physics.pause();
    this.bird.setTint(0xff0000);

    this.time.addEvent({
      delay: 1000,
      callback: function () {
        this.scene.restart();
      },
      callbackScope: this,
    });
  };

  /*
    The update function is called by Phaser at the start of every frame. 
    It is used to update game objects like sprites, text, and shapes. 
    In this case, we are updating the position of the bird sprite.
  */
  update = function (time, delta) {
    const { bird, cloud, cloud2, pipes, config } = this;

    if (bird.x > config.width) {
      // reset the bird's position to the top of the screen
      bird.x = config.width / 10;
      bird.y = config.height / 2;

      // reset the bird's velocity
      bird.setVelocity(...this.BIRD_VELOCITY);
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

    // the pipes are offscreen, so we can reset them to the righmost x position,
    // and a random y position
    if (offscreenPipes.length === 2) {
      this.redrawPipes(offscreenPipes);
      this.score += 1;
      this.scoreText.setText(`Score: ${this.score}`);
    }

    if (bird.getBounds().bottom === config.height) {
      this.gameOver();
    }
  };

  birdFlap(event) {
    this.bird.setVelocityY(-150);
  };

  redrawPipes = function (offscreenPipes) {
    const { config } = this;

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
  };
}

export default PlayScene;
