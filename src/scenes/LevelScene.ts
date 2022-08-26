import Phaser from "phaser";

import DestinationBlock from "../gameObjects/blocks/DestinationBlock";
import StartBlock from "../gameObjects/blocks/StartBlock";
import EndBlock from "../gameObjects/blocks/EndBlock";
import SourceBlock from "../gameObjects/blocks/SourceBlock";
import Variables from "../globals/Variables";
import Block from "../gameObjects/blocks/Block";

export default abstract class LevelScene extends Phaser.Scene {
  /**
   * Variables that are present in the simulation for that level.
   */
  protected variables!: Variables;

  /**
   * `startBlock` displays the initial values of
   * variables needed for the level.
   * @example
   * int x = 0, a, b;
   */
  protected startBlock!: StartBlock;

  /**
   * `endBlock` displays the goal or the value of
   * a variable at the end of the simulation.
   * @example
   * x = 10;
   */
  protected endBlock!: EndBlock;

  /**
   * Each `SourceBlock` displays an instruction to
   * manipulate the value in the level.
   *
   * `sourceBlocks[][]` is a matrix or a 2D array.
   * The row has an array of `SourceBlock` and the
   * value of the row is the index of its pairing
   * `DestinationBlock` in `destinationBlocks[]`.
   * @example
   * a = 5; | b = 10;
   */
  protected sourceBlocks: SourceBlock[][] = [];

  /**
   * `DestinationBlock` is the zone in which its
   * pairing `SourceBlock`s will be dropped.
   *
   * `destinationBlocks[]` is an array which
   * represents the number of instructions needed
   * for the simulation of the level.
   */
  protected destinationBlocks: DestinationBlock[] = [];

  /**
   * List of `Block`s consisting of the `StartBlock`, `EndBlock`
   * and the `SourceBlock`s occupying their respective `DestinationBlock`.
   *
   * The size of this list depends on the size of the `DestinationBlock`s
   * (not the size of `SourceBlock`s since one `DestinationBlock` could
   * consist of one or more `SourceBlock`s), the `StartBlock`, and the
   * `EndBlock`.
   *
   * @example
   *     StartBlock
   *         |
   * DestinationBlock  --  SourceBlock  | SourceBlock
   *         |
   * DestinationBlock  --  SourceBlock  | SourceBlock | SourceBlock
   *         |
   * DestinationBlock  --  SourceBlock  | SourceBlock
   *         |
   *     EndBlock
   * The size of `instructionBlockList` would be 5.
   *
   */
  protected instructionBlockList!: Block[] | null[];

  constructor(sceneName: string) {
    super(sceneName);
  }

  // ========== Phaser Methods ==========
  public preload(): void {
    this.load.path = "assets/blocks/";
    this.load.image("start_block", "start_block.png");
    this.load.image("end_block", "end_block.png");
    this.load.image("source_block", "source_block.png");
    this.load.image("destination_block", "destination_block.png");
  }

  public create(): void {
    this.initBlocks();
    this.initVariableActionCallbacks();
    this.initInstructionBlockList();
    this.registerSrcBlkToDestBlk();
    this.handleEvents();
  }

  public update(): void {
    // TODO: Animation.
  }
  // ========== End of Phaser Methods ==========

  // ========== Level Scene Method (Public Callable Method) ==========
  public executeActionCallbacks() {
    /**
     * Arrays.forEach() does not have a way to stop the iteration
     * when the element is `null`.
     * @example
     * > Case 1
     * StartBlock
     * (occupied) DestinationBlock
     * (occupied) DestinationBlock
     * (null) DestinationBlock      <--- Stops here.
     * EndBlock                     <--- Will not call `variableActionCallback().
     *
     * > Case 2
     * StartBlock
     * (occupied) DestinationBlock
     * (null) DestinationBlock      <--- Stops here.
     * (occupied) DestinationBlock  <--- Will not call `variableActionCallback().
     * EndBlock                     <--- Will not call `variableActionCallback().
     */
    for (const block of this.instructionBlockList) {
      if (!block) break;

      block.variableActionCallback();
    }
  }

  public removeSourceBlockFromList(rowPosition: number): void {
    delete this.instructionBlockList[rowPosition];
  }
  // ========== End of Level Scene Method (Public Callable Method) ==========

  // ========== Level Scene Method (Derived Class Callable Method) ==========
  protected showResult(text: string) {
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, text, {
        font: "bold 40px Arial",
        color: "white",
        backgroundColor: "black",
        resolution: 3
      })
      .setPadding(10, 5)
      .setOrigin(0.5);
  }
  // ========== End of Level Scene Method (Derived Class Callable Method) ==========

  // ========== Level Scene Method ==========
  protected initInstructionBlockList(): void {
    this.instructionBlockList = new Array(
      1 + this.destinationBlocks.length + 1
    );

    this.instructionBlockList[0] = this.startBlock;
    // The middle blocks are null since that will be filled up by
    // the player's chosend SourceBlock.
    const lastIndex = this.instructionBlockList.length - 1;
    this.instructionBlockList[lastIndex] = this.endBlock;
  }

  protected registerSrcBlkToDestBlk(): void {
    this.sourceBlocks.forEach(
      (rowSourceBlocks: SourceBlock[], destinationIndex: number) =>
        rowSourceBlocks.forEach(
          (sourceBlock: SourceBlock) =>
            (sourceBlock.destinationBlock =
              this.destinationBlocks[destinationIndex])
        )
    );
  }

  protected handleEvents(): void {
    this.input
      .on("drag", this.drag)
      .on("dragstart", this.dragStart)
      .on("dragend", this.dragEnd)
      .on("dragenter", this.dragEnter)
      .on("dragleave", this.dragLeave)
      .on("drop", this.drop, this);
  }
  // ========== End of Level Scene Method ==========

  // ========== Level Scene Method (Event Callbacks) ==========
  protected drag = (
    pointer: Phaser.Input.Pointer,
    gameObject: SourceBlock,
    dragX: number,
    dragY: number
  ): void => {
    gameObject.setPosition(dragX, dragY);
  };

  protected dragStart = (
    pointer: Phaser.Input.Pointer,
    gameObject: SourceBlock
  ): void => {
    gameObject.bgImageObj.setTint(0x00bb00);
  };

  protected dragEnd = (
    pointer: Phaser.Input.Pointer,
    gameObject: SourceBlock,
    dropped: boolean
  ): void => {
    if (!dropped) gameObject.resetPosition();
    gameObject.bgImageObj.clearTint();
  };

  protected dragEnter = (
    pointer: Phaser.Input.Pointer,
    gameObject: SourceBlock,
    target: Phaser.GameObjects.Zone
  ): void => {
    const destinationContainer = target.parentContainer as DestinationBlock;

    if (gameObject.destinationBlock !== destinationContainer) return;

    // Preview the original position of the occupying SourceBlock.
    if (destinationContainer.occupiedBy)
      destinationContainer.occupiedBy.resetPosition();

    destinationContainer.bgImageObj.setTint(0x00bb00);
  };

  protected dragLeave = (
    pointer: Phaser.Input.Pointer,
    gameObject: SourceBlock,
    target: Phaser.GameObjects.Zone
  ): void => {
    const destinationContainer = target.parentContainer as DestinationBlock;

    if (gameObject.destinationBlock !== destinationContainer) return;

    // `SourceBlock` will reoccupy its `DestinationBlock`.
    if (destinationContainer.occupiedBy)
      destinationContainer.occupiedBy.setPosition(
        destinationContainer.x,
        destinationContainer.y
      );

    destinationContainer.bgImageObj.clearTint();
  };

  protected drop = (
    pointer: Phaser.Input.Pointer,
    gameObject: SourceBlock,
    target: Phaser.GameObjects.Zone
  ): void => {
    const destinationContainer = target.parentContainer as DestinationBlock;

    if (gameObject.destinationBlock !== destinationContainer) {
      gameObject.setPosition(
        gameObject.input.dragStartX,
        gameObject.input.dragStartY
      );

      return;
    }

    // Dragged `gameObject` replaces the `destinationContainer.occupiedBy`
    // and reset its position.
    if (destinationContainer.occupiedBy)
      destinationContainer.occupiedBy.resetPosition();

    gameObject.setPosition(destinationContainer.x, destinationContainer.y);

    destinationContainer.occupiedBy = gameObject;
    this.instructionBlockList[destinationContainer.rowPosition] = gameObject;

    this.executeActionCallbacks();
  };
  // ========== End of Level Scene Method (Event Callbacks) ==========

  // ========== Abstract Methods ==========
  protected abstract initVariableActionCallbacks(): void;
  protected abstract initBlocks(): void;
  // ========== End of Abstract Methods ==========
}
