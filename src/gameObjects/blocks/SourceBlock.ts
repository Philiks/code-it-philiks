import Block from "./Block";
import DestinationBlock from "./DestinationBlock";

export default class SourceBlock extends Block {
  /**
   * Position before occupying a `DestinationBlock`.
   */
  readonly _originalPosition!: { x: number; y: number };
  private _destinationBlock!: DestinationBlock;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this._originalPosition = { x, y };
  }

  /**
   * Calls the `this.initObjects()`. Texture is not needed as a
   * parameter since each derived classes has their own `texture`.
   * While the *code* or `text` that will be put on that block will
   * depend on the level design.
   * @param text The *code* that the block contains.
   */
  create(text: string): void {
    this.initObjects("source_block", text);
    this.scene.input.setDraggable(this);
  }

  update(): void {
    // TODO: Animation.
  }

  resetPosition() {
    const { x, y } = this._originalPosition;
    this.setPosition(x, y);
  }

  set destinationBlock(theDestinationBlock: DestinationBlock) {
    this._destinationBlock = theDestinationBlock;
  }

  get destinationBlock() {
    return this._destinationBlock;
  }
}
