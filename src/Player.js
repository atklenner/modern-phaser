import Phaser from "phaser";

export default class Player {
  constructor(scene, key = "dude") {
    this.scene = scene;
    this.key = key;

    this._player = this.scene.physics.add.sprite(100, 450, this.key);
    this._player.setBounce(0.2);
    this._player.setCollideWorldBounds(true);

    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: this.key, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers(this.key, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  get player() {
    return this._player;
  }

  moveLeft() {
    this._player.setVelocityX(-160);
    this._player.anims.play("left", true);
  }

  moveRight() {
    this.player.setVelocityX(160);
    this.player.anims.play("right", true);
  }

  stop() {
    this.player.setVelocityX(0);
    this.player.anims.play("turn");
  }

  jump() {
    this.player.setVelocityY(-330);
  }
}
