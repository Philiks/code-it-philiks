import Block from "./Block";
import SourceBlock from "./SourceBlock";

export default class DestinationBlock extends Block {
  private _dropZoneObj!: Phaser.GameObjects.Zone;
  private _occupiedBy?: SourceBlock;

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
    this.initObjects("destination_block", text);

    this._dropZoneObj = this.scene.add
      .zone(0, 0, this.width, this.height)
      .setRectangleDropZone(this.width, this.height);
    this.add(this._dropZoneObj);
  }

  update(): void {
    // TODO: Animation.
  }

  get dropZoneObj(): Phaser.GameObjects.Zone {
    return this._dropZoneObj;
  }

  set occupiedBy(theSourceBlock: SourceBlock | undefined) {
    this._occupiedBy = theSourceBlock;
  }

  get occupiedBy() {
    return this._occupiedBy;
  }
}
