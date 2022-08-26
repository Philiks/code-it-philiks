import { VariableActionCallback } from "../../globals/Variables";

import DestinationBlock from "./DestinationBlock";

export default abstract class Block extends Phaser.GameObjects.Container {
  /**
   * The `LevelScene` has a field for `Variables`;
   * derived classes of `Block` class are responsible
   * for *initializing* (i.e. `StartBlock`), *updating*
   * (i.e. `SourceBlock`), and *comparing* (i.e. `EndBlock`).
   *
   * **NOTE:** `DestinationBlock` does not have this
   * field since it has access to its `SourceBlock` via
   * its `occupiedBy` field.
   */
  protected _variableActionCallback: VariableActionCallback | undefined;

  /**
   * The texture that the Block will use.
   *
   * Access via *(getter)* `bgImageObj`.
   */
  protected _bgImageObj!: Phaser.GameObjects.Image;

  /**
   * The text to be displayed on the block.
   *
   * Mutate via *(setter)* `bgImageObj()`.
   */
  protected _textObj!: Phaser.GameObjects.Text;

  /**
   * Creates a `Container`|`Block` that contains different
   * `Phaser.GameObjects`.
   * @param scene The `Phaser.Scene` that this `Container` will belong to.
   * @param x The horizontal position of this block.
   * @param y The vertical position of this block.
   */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
  }

  /**
   * Initializes the objects that this `Container`|`Block` have.
   * @param texture The name of the asset registered in the `preload()`.
   * @param text The text to be displayed on the block.
   */
  protected initObjects(texture: string, text: string): void {
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
   *
   * While the *code* or `text` that will be put on that block will
   * depend on the level design.
   * @param text The *code* that the block contains.
   */
  public abstract create(text: string): void;
  public abstract update(): void;

  /**
   * Sets the callback function that either *initializes*, *updates*, *compares*
   * the `Variables` field once called.
   * @param theVariableActionCallback Callback function that can be called to change the `Variables`.
   */
  set variableActionCallback(
    theVariableActionCallback: VariableActionCallback
  ) {
    // `DestinationBlock` does not have `VariableActionCallback`.
    if (this instanceof DestinationBlock) return;

    this._variableActionCallback = theVariableActionCallback;
  }

  get variableActionCallback(): VariableActionCallback {
    if (!this._variableActionCallback)
      throw new Error("VariableActionCallback has not been set.");

    return this._variableActionCallback;
  }

  get bgImageObj(): Phaser.GameObjects.Image {
    return this._bgImageObj;
  }

  get textObj(): Phaser.GameObjects.Text {
    return this._textObj;
  }
}
