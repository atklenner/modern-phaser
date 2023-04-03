import Phaser from "phaser";

export default class StarSpawner {
  constructor(scene, starKey = "star") {
    this.scene = scene;
    this.key = starKey;

    this._group = this.scene.physics.add.group({
      key: this.key,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this._group.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });
  }

  get group() {
    return this._group;
  }

  checkAllStars() {
    if (this._group.countActive(true) === 0) {
      this._group.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }
}
