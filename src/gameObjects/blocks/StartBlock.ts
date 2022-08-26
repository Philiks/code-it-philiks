import Block from "./Block";

export default class StartBlock extends Block {
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
   * Calls the `this.initObjects()`. Texture is not needed as a
   * parameter since each derived classes has their own `texture`.
   *
   * While the *code* or `text` that will be put on that block will
   * depend on the level design.
   * @param text The *code* that the block contains.
   */
  public create(text: string): void {
    this.initObjects("start_block", text);
  }

  public update(): void {
    // TODO: Animation.
  }
}
