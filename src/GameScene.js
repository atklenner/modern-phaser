import Phaser from "phaser";
import ScoreLabel from "./ui/ScoreLabel";
import BombSpawner from "./BombSpawner";
import StarSpawner from "./StarSpawner";
import Player from "./Player";

const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.playerManager = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.starSpawner = undefined;
    this.bombSpawner = undefined;

    this.gameOver = false;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image(GROUND_KEY, "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image(BOMB_KEY, "assets/bomb.png");

    this.load.spritesheet(DUDE_KEY, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    const platforms = this.createPlatforms();

    this.playerManager = new Player(this, DUDE_KEY);
    const player = this.playerManager.player;

    this.starSpawner = new StarSpawner(this, STAR_KEY);
    const starGroup = this.starSpawner.group;

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(starGroup, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(player, bombsGroup, this.hitBomb, null, this);

    this.physics.add.overlap(player, starGroup, this.collectStar, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.playerManager.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.playerManager.moveRight();
    } else {
      this.playerManager.stop();
    }

    if (
      this.cursors.up.isDown &&
      this.playerManager.player.body.touching.down
    ) {
      this.playerManager.jump();
    }
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);

    return platforms;
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.scoreLabel.add(10);

    this.starSpawner.checkAllStars();

    this.bombSpawner.spawn(player.x);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    this.gameOver = true;
  }
}
