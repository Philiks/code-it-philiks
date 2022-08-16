import Phaser from "phaser";

import config from "./config";
import GameScene from "./scenes/LevelScene";

const game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene],
  })
);
