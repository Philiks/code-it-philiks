import Phaser from "phaser";

import config from "./globals/config";
import LevelOneScene from "./scenes/LevelOneScene";

// TODO: Create multiple levels. Change this to LevelOne after.
const game = new Phaser.Game(
  Object.assign(config, {
    scene: [LevelOneScene],
  })
);
