export default abstract class Block extends Phaser.GameObjects.Container {
  protected _bgImageObj!: Phaser.GameObjects.Image;
  protected _textObj!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
  }

  initObjects(texture: string, text: string): void {
    this._bgImageObj = this.scene.add
      .image(0, 0, texture)
      .setDisplaySize(250, 75)
      .setSize(250, 75);

    this._textObj = this.scene.add
      .text(0, 0, text, {
        font: "bold 12px Arial",
        color: "black",
        resolution: 3,
      })
      .setOrigin(0.5);

    this.add(this._bgImageObj)
      .add(this._textObj)
      .setSize(this._bgImageObj.width, this._bgImageObj.height)
      .setInteractive()
      .scene.add.existing(this);
  }

  /**
   * Calls the `this.initObjects()`. Texture is not needed as a
   * parameter since each derived classes has their own `texture`.
   * While the *code* or `text` that will be put on that block will
   * depend on the level design.
   * @param text The *code* that the block contains.
   */
  abstract create(text: string): void;
  abstract update(): void;

  get bgImageObj(): Phaser.GameObjects.Image {
    return this._bgImageObj;
  }

  get textObj(): Phaser.GameObjects.Text {
    return this._textObj;
  }
}
