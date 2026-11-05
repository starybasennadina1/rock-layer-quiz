// Fixed Codex asset contract (Step 1.5). Reference ONLY these names.
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
} as const;

export type SpriteKey = 'sprite1' | 'sprite2' | 'sprite3' | 'sprite4' | 'sprite5';

export const SPRITES: Record<SpriteKey, number> = {
  sprite1: assets.sprite1,
  sprite2: assets.sprite2,
  sprite3: assets.sprite3,
  sprite4: assets.sprite4,
  sprite5: assets.sprite5,
};

export default assets;
