import Block from "./Block";

export default class StartBlock extends Block {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
  }

  /**
   * Calls the `this.initObjects()`. Texture is not needed as a
   * parameter since each derived classes has their own `texture`.
   * While the *code* or `text` that will be put on that block will
   * depend on the level design.
   * @param text The *code* that the block contains.
   */
  create(text: string): void {
    this.initObjects("start_block", text);
  }

  update(): void {
    // TODO: Animation.
  }
}
