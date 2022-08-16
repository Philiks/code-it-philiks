import Phaser from 'phaser';

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('LevelScene');
  }

  preload() {
    this.load.image('logo', 'assets/cip-logo.png');
    this.load.image('fire', 'assets/fire1.png');
  }

  create() {
    const particle = this.add.particles('fire');
    const emitter = particle.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    const logo = this.add.image(400, 70, 'logo');
    logo.setScale(0.25);
    emitter.startFollow(logo);

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}
