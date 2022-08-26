import Phaser from "phaser";

import DestinationBlock from "../gameObjects/blocks/DestinationBlock";
import StartBlock from "../gameObjects/blocks/StartBlock";
import EndBlock from "../gameObjects/blocks/EndBlock";
import SourceBlock from "../gameObjects/blocks/SourceBlock";

// TODO: Create multiple levels. Change this to LevelOne after.
export default class LevelScene extends Phaser.Scene {
  constructor() {
    super("LevelScene");
  }

  preload(): void {
    this.load.path = "assets/blocks/";
    this.load.image("start_block", "start_block.png");
    this.load.image("end_block", "end_block.png");
    this.load.image("source_block", "source_block.png");
    this.load.image("destination_block", "destination_block.png");
  }

  create(): void {
    // Start
    const startBlock = new StartBlock(this, 200, 50);
    startBlock.create("int x = 0;");

    // Destination
    const firstDestinationBlock = new DestinationBlock(this, 200, 150);
    firstDestinationBlock.create("// Drag a Source Block here.");

    const secondDestinationBlock = new DestinationBlock(this, 200, 225);
    secondDestinationBlock.create("// Drag a Source Block here.");

    const thirdDestinationBlock = new DestinationBlock(this, 200, 300);
    thirdDestinationBlock.create("// Drag a Source Block here.");

    // Source
    const firstSourceBlockLeft = new SourceBlock(this, 450, 150);
    firstSourceBlockLeft.create("int a = 10;");

    const firstSourceBlockRight = new SourceBlock(this, 675, 150);
    firstSourceBlockRight.create("int b = 5;");

    const secondSourceBlockLeft = new SourceBlock(this, 450, 225);
    secondSourceBlockLeft.create("x = a;");

    const secondSourceBlockRight = new SourceBlock(this, 675, 225);
    secondSourceBlockRight.create("x = b;");

    const thirdSourceBlockLeft = new SourceBlock(this, 450, 300);
    thirdSourceBlockLeft.create("x = x + a;");

    const thirdSourceBlockRight = new SourceBlock(this, 675, 300);
    thirdSourceBlockRight.create("x = x + b;");

    // End
    const endBlock = new EndBlock(this, 200, 400);
    endBlock.create("x = 10;");

    // Register SourceBlocks to their DestinationBlock.
    firstSourceBlockLeft.destinationBlock = firstDestinationBlock;
    firstSourceBlockRight.destinationBlock = firstDestinationBlock;
    secondSourceBlockLeft.destinationBlock = secondDestinationBlock;
    secondSourceBlockRight.destinationBlock = secondDestinationBlock;
    thirdSourceBlockLeft.destinationBlock = thirdDestinationBlock;
    thirdSourceBlockRight.destinationBlock = thirdDestinationBlock;

    this.input
      .on(
        "drag",
        (
          pointer: Phaser.Input.Pointer,
          gameObject: SourceBlock,
          dragX: number,
          dragY: number
        ): void => {
          gameObject.setPosition(dragX, dragY);
        }
      )
      .on(
        "dragstart",
        (pointer: Phaser.Input.Pointer, gameObject: SourceBlock): void => {
          gameObject.bgImageObj.setTint(0x00bb00);
        }
      )
      .on(
        "dragend",
        (
          pointer: Phaser.Input.Pointer,
          gameObject: SourceBlock,
          dropped: boolean
        ): void => {
          if (!dropped)
            gameObject.setPosition(
              gameObject.input.dragStartX,
              gameObject.input.dragStartY
            );
          gameObject.bgImageObj.clearTint();
        }
      )
      .on(
        "dragenter",
        (
          pointer: Phaser.Input.Pointer,
          gameObject: SourceBlock,
          target: Phaser.GameObjects.Zone
        ): void => {
          const destinationContainer =
            target.parentContainer as DestinationBlock;
          if (gameObject.destinationBlock === destinationContainer) {
            // Preview the original position of the occupying SourceBlock.
            if (destinationContainer.occupiedBy)
              destinationContainer.occupiedBy.resetPosition();

            destinationContainer.bgImageObj.setTint(0x00bb00);
          }
        }
      )
      .on(
        "dragleave",
        (
          pointer: Phaser.Input.Pointer,
          gameObject: SourceBlock,
          target: Phaser.GameObjects.Zone
        ): void => {
          const destinationContainer =
            target.parentContainer as DestinationBlock;
          if (gameObject.destinationBlock === destinationContainer) {
            // Preview the original position of the occupying SourceBlock.
            if (destinationContainer.occupiedBy)
              destinationContainer.occupiedBy.setPosition(
                destinationContainer.x,
                destinationContainer.y
              );

            destinationContainer.bgImageObj.clearTint();
          }
        }
      )
      .on(
        "drop",
        (
          pointer: Phaser.Input.Pointer,
          gameObject: SourceBlock,
          target: Phaser.GameObjects.Zone
        ): void => {
          const destinationContainer =
            target.parentContainer as DestinationBlock;
          if (gameObject.destinationBlock === destinationContainer) {
            // Return the occupying SourceBlock to its original position.
            if (destinationContainer.occupiedBy)
              destinationContainer.occupiedBy.resetPosition();

            gameObject.setPosition(
              destinationContainer.x,
              destinationContainer.y
            );
            destinationContainer.occupiedBy = gameObject;

            // TODO: Identify whether it is correct or not. Decide whether to have an internal parser or not.
          } else {
            gameObject.setPosition(
              gameObject.input.dragStartX,
              gameObject.input.dragStartY
            );
          }
        }
      );
  }

  update(): void {
    // TODO: Animation.
  }
}
