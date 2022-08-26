import LevelScene from "../../scenes/LevelScene";

import Block from "./Block";
import DestinationBlock from "./DestinationBlock";

export default class SourceBlock extends Block {
  /**
   * Position before occupying a `DestinationBlock`.
   *
   * NOTE: This is `private` instead of `readonly` since
   * `SourceBlock` only uses this in `resetPosition()`.
   */
  readonly originalPosition: { x: number; y: number };

  /**
   * The `DestinationBlock` instance that this `SourceBlock`
   * will be occupying.
   *
   * This should be registered during the `create()` cycle
   * of the `Scene`.
   *
   * Access via *(getter)* `destinationBlock`.\
   * Mutate via *(setter)* `destinationBlock()`.
   */
  private _destinationBlock!: DestinationBlock;

  /**
   * Creates a `Container`|`SourceBlock` that contains different
   * `Phaser.GameObjects`.
   * @param scene The `Phaser.Scene` that this `Container` will belong to.
   * @param x The horizontal position of this block.
   * @param y The vertical position of this block.
   */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.originalPosition = { x, y };
  }

  /**
   * Calls the `this.initObjects()`. Texture is not needed as a
   * parameter since each derived classes has their own `texture`.
   
   * While the *code* or `text` that will be put on that block will
   * depend on the level design.
   * @param text The *code* that the block contains.
   */
  public create(text: string): void {
    this.initObjects("source_block", text);

    this.scene.input.setDraggable(this);
    this.on("pointerdown", this.pointerDown);
  }

  public update(): void {
    // TODO: Animation.
  }

  public resetPosition(): void {
    const { x, y } = this.originalPosition;
    this.setPosition(x, y);
  }

  protected pointerDown = (): void => {
    if (
      !this.destinationBlock.occupiedBy ||
      this.destinationBlock.occupiedBy !== this
    )
      return;

    // Remove this occupying `SourceBlock` and reset position.
    // `DestinationBlock` will be empty.
    const levelScene = this.scene as LevelScene;
    this.resetPosition();

    // Remove this `SourceBlock` instance in the `destinationBlock.occupiedBy`
    this.destinationBlock.occupiedBy = undefined;
    this.destinationBlock.bgImageObj.clearTint();

    // Remove this `SourceBlock` instance in the `instructionBlockList` fields.
    levelScene.removeSourceBlockFromList(this.destinationBlock.rowPosition);
    levelScene.executeActionCallbacks();
  };

  set destinationBlock(theDestinationBlock: DestinationBlock) {
    this._destinationBlock = theDestinationBlock;
  }

  get destinationBlock() {
    return this._destinationBlock;
  }
}
