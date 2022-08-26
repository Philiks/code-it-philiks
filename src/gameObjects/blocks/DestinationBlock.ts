import Block from "./Block";
import SourceBlock from "./SourceBlock";

export default class DestinationBlock extends Block {
  /**
   * The row position of the `DestinationBlock` on the list.
   * This starts at 1 and **NOT** 0. Since this will be used
   * by `LevelScene.instructionBlockList` where the first
   * index [0] is reserved for the `StartBlock`.
   */
  readonly rowPosition!: number;

  /**
   * The *Drop Target* that will trigger `drag*` events.
   *
   * i.e. `dragEnter` event triggers when a `SourceBlock`
   * enters this `DestinationBlock`.
   *
   * Access via *(getter)* `dropZoneObj`.
   */
  private _dropZoneObj!: Phaser.GameObjects.Zone;

  /**
   * The `SourceBlock` instance that occupies this
   * `DestinationBlock`.
   *
   * Access via *(getter)* `occupiedBy`.\
   * Mutate via *(setter)* `occupiedBy()`.
   */
  private _occupiedBy?: SourceBlock;

  /**
   * Creates a `Container`|`DestinationBlock` that contains different
   * `Phaser.GameObjects`.
   * @param scene The `Phaser.Scene` that this `Container` will belong to.
   * @param x The horizontal position of this block.
   * @param y The vertical position of this block.
   * @param rowPosition The row position of this block. Starts at 1.
   */
  constructor(scene: Phaser.Scene, x: number, y: number, rowPosition: number) {
    super(scene, x, y);
    this.rowPosition = rowPosition;
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
    this.initObjects("destination_block", text);

    this._dropZoneObj = this.scene.add
      .zone(0, 0, this.width, this.height)
      .setRectangleDropZone(this.width, this.height);
    this.add(this._dropZoneObj);
  }

  public update(): void {
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
