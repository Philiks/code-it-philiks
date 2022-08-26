import DestinationBlock from "../gameObjects/blocks/DestinationBlock";
import StartBlock from "../gameObjects/blocks/StartBlock";
import EndBlock from "../gameObjects/blocks/EndBlock";
import SourceBlock from "../gameObjects/blocks/SourceBlock";

import LevelScene from "./LevelScene";

export default class LevelOneScene extends LevelScene {
  constructor() {
    super("LevelOneScene");
  }

  protected initBlocks(): void {
    // Start Block.
    this.startBlock = new StartBlock(this, 200, 50);
    this.startBlock.create("int x = 0, a, b;");

    // Destination Block.
    this.destinationBlocks.push(
      new DestinationBlock(this, 200, 150, 1),
      new DestinationBlock(this, 200, 225, 2),
      new DestinationBlock(this, 200, 300, 3)
    );

    this.destinationBlocks.forEach((destinationBlock: DestinationBlock) =>
      destinationBlock.create("// Drag a Source Block here.")
    );

    // Source Block.
    this.sourceBlocks.push([
      new SourceBlock(this, 450, 150),
      new SourceBlock(this, 675, 150),
    ]);

    this.sourceBlocks.push([
      new SourceBlock(this, 450, 225),
      new SourceBlock(this, 675, 225),
    ]);

    this.sourceBlocks.push([
      new SourceBlock(this, 450, 300),
      new SourceBlock(this, 675, 300),
    ]);

    this.sourceBlocks[0][0].create("int a = 3;");
    this.sourceBlocks[0][1].create("int b = 5;");

    this.sourceBlocks[1][0].create("x = a;");
    this.sourceBlocks[1][1].create("x = b;");

    this.sourceBlocks[2][0].create("x = x + a;");
    this.sourceBlocks[2][1].create("x = x + b;");

    // End Block.
    this.endBlock = new EndBlock(this, 200, 400);
    this.endBlock.create("x = 10;");
  }

  protected initVariableActionCallbacks(): void {
    // Start Block.
    this.startBlock.variableActionCallback = () => {
      this.variables = {
        varX: 0,
        varA: null,
        varB: null,
      };
    };

    // Source Block.
    this.sourceBlocks[0][0].variableActionCallback = () =>
      (this.variables.varA = 3);
    this.sourceBlocks[0][1].variableActionCallback = () =>
      (this.variables.varB = 5);

    this.sourceBlocks[1][0].variableActionCallback = () =>
      (this.variables.varX = this.variables.varA);
    this.sourceBlocks[1][1].variableActionCallback = () =>
      (this.variables.varX = this.variables.varB);

    this.sourceBlocks[2][0].variableActionCallback = () =>
      (this.variables.varX += this.variables.varA);
    this.sourceBlocks[2][1].variableActionCallback = () =>
      (this.variables.varX += this.variables.varB);

    // End Block.
    this.endBlock.variableActionCallback = () => {
      const text = this.variables.varX === 10 ? "SUCCESS" : "FAILED";
      this.add
        .text(this.cameras.main.centerX, this.cameras.main.centerY, text, {
          font: "bold 20px Arial",
          color: "black",
          resolution: 3,
        })
        .setOrigin(0.5);
    };
  }
}
