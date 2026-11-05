import type { SpriteKey } from '../assets';

export type RockType = 'igneous' | 'sedimentary' | 'metamorphic' | 'mineral';

export type Rock = {
  id: string;
  name: string;
  type: RockType;
  grain: string;
  colour: string;
  hardness: string;
  sprite: SpriteKey;
  blurb: string;
};

export const UNITS: { id: RockType; label: string; colour: string }[] = [
  { id: 'igneous', label: 'IGNEOUS', colour: '#C97B4A' },
  { id: 'sedimentary', label: 'SEDIMENTARY', colour: '#D9B36C' },
  { id: 'metamorphic', label: 'METAMORPHIC', colour: '#7FC8A9' },
];

export const TYPE_LABEL: Record<RockType, string> = {
  igneous: 'IGNEOUS',
  sedimentary: 'SEDIMENTARY',
  metamorphic: 'METAMORPHIC',
  mineral: 'MINERAL',
};

// sprite_1 igneous - sprite_2 sedimentary - sprite_3 metamorphic - sprite_5 minerals
export const SPRITE_FOR_TYPE: Record<RockType, SpriteKey> = {
  igneous: 'sprite1',
  sedimentary: 'sprite2',
  metamorphic: 'sprite3',
  mineral: 'sprite5',
};

const mk = (
  id: string,
  name: string,
  type: RockType,
  grain: string,
  colour: string,
  hardness: string,
  blurb: string,
): Rock => ({
  id,
  name,
  type,
  grain,
  colour,
  hardness,
  sprite: SPRITE_FOR_TYPE[type],
  blurb,
});

export const ROCKS: Rock[] = [
  // ---- IGNEOUS (10)
  mk('granite', 'Granite', 'igneous', 'COARSE', 'GREY-PINK', '6', 'Cooled slowly deep underground, so its crystals grew big.'),
  mk('basalt', 'Basalt', 'igneous', 'FINE', 'DARK GREY', '6', 'Most of the ocean floor is made of this fast-cooled lava.'),
  mk('obsidian', 'Obsidian', 'igneous', 'GLASSY', 'BLACK', '5', 'Lava chilled so fast it turned into natural glass.'),
  mk('pumice', 'Pumice', 'igneous', 'FROTHY', 'PALE GREY', '6', 'Full of gas bubbles, which is why it can float on water.'),
  mk('gabbro', 'Gabbro', 'igneous', 'COARSE', 'DARK GREEN', '6', 'Basalt that cooled slowly, so you can see every crystal.'),
  mk('rhyolite', 'Rhyolite', 'igneous', 'FINE', 'PINK-TAN', '6', 'The fast-cooled cousin of granite, found near volcanoes.'),
  mk('andesite', 'Andesite', 'igneous', 'FINE', 'GREY-BROWN', '6', 'Named after the Andes mountains, where it is very common.'),
  mk('diorite', 'Diorite', 'igneous', 'COARSE', 'SALT-PEPPER', '6', 'Black and white speckles, like granite in pyjamas.'),
  mk('scoria', 'Scoria', 'igneous', 'BUBBLY', 'RUST RED', '5', 'Heavier than pumice, with bigger gas holes inside.'),
  mk('peridotite', 'Peridotite', 'igneous', 'COARSE', 'OLIVE GREEN', '6', 'Comes from the mantle, the hot layer under the crust.'),

  // ---- SEDIMENTARY (10)
  mk('sandstone', 'Sandstone', 'sedimentary', 'SANDY', 'TAN-ORANGE', '6', 'Old beaches and dunes squeezed into solid stone.'),
  mk('limestone', 'Limestone', 'sedimentary', 'FINE', 'CREAM GREY', '3', 'Built from countless tiny shells on an ancient sea floor.'),
  mk('shale', 'Shale', 'sedimentary', 'VERY FINE', 'DARK GREY', '3', 'Mud hardened into paper-thin layers you can split apart.'),
  mk('conglomerate', 'Conglomerate', 'sedimentary', 'PEBBLY', 'MIXED', '6', 'Rounded river pebbles glued by natural cement.'),
  mk('coal', 'Coal', 'sedimentary', 'DULL', 'BLACK', '2', 'Squashed swamp plants from forests older than dinosaurs.'),
  mk('chalk', 'Chalk', 'sedimentary', 'POWDERY', 'WHITE', '2', 'Microscopic plankton shells, soft enough to write with.'),
  mk('breccia', 'Breccia', 'sedimentary', 'ANGULAR', 'MIXED', '6', 'Like conglomerate, but the pieces are sharp, not rounded.'),
  mk('siltstone', 'Siltstone', 'sedimentary', 'FINE', 'BUFF GREY', '4', 'Grains finer than sand but coarser than mud.'),
  mk('rocksalt', 'Rock Salt', 'sedimentary', 'CRYSTAL', 'CLEAR PINK', '2', 'Left behind when an ancient salty sea dried up.'),
  mk('flint', 'Flint', 'sedimentary', 'GLASSY', 'DARK GREY', '7', 'So hard and sharp that Stone Age people made tools from it.'),

  // ---- METAMORPHIC (10)
  mk('marble', 'Marble', 'metamorphic', 'SUGARY', 'WHITE SWIRL', '3', 'Limestone baked by heat until its crystals regrew.'),
  mk('slate', 'Slate', 'metamorphic', 'VERY FINE', 'BLUE GREY', '4', 'Squeezed shale that splits into flat roof tiles.'),
  mk('gneiss', 'Gneiss', 'metamorphic', 'BANDED', 'GREY-PINK', '6', 'Heat and pressure sorted its minerals into stripes.'),
  mk('schist', 'Schist', 'metamorphic', 'FLAKY', 'SILVER GREY', '5', 'Sparkles because it is packed with flat mica flakes.'),
  mk('quartzite', 'Quartzite', 'metamorphic', 'SUGARY', 'WHITE GREY', '7', 'Sandstone welded so tightly the grains vanished.'),
  mk('phyllite', 'Phyllite', 'metamorphic', 'SILKY', 'SILVER GREEN', '4', 'Halfway between slate and schist, with a satin shine.'),
  mk('anthracite', 'Anthracite', 'metamorphic', 'SHINY', 'JET BLACK', '3', 'Coal pressed further until it turned glossy and hard.'),
  mk('hornfels', 'Hornfels', 'metamorphic', 'FINE', 'DARK BROWN', '6', 'Baked hard where hot magma touched the rock around it.'),
  mk('soapstone', 'Soapstone', 'metamorphic', 'SMOOTH', 'GREY GREEN', '1', 'So soft you can scratch it with a fingernail.'),
  mk('amphibolite', 'Amphibolite', 'metamorphic', 'COARSE', 'BLACK GREEN', '6', 'Dark and tough, born from basalt deep in a mountain root.'),

  // ---- MINERALS (10)
  mk('quartz', 'Quartz', 'mineral', 'CRYSTAL', 'CLEAR WHITE', '7', 'One of the commonest minerals, and it grows six-sided points.'),
  mk('feldspar', 'Feldspar', 'mineral', 'BLOCKY', 'PINK CREAM', '6', 'The most abundant mineral group in the whole crust.'),
  mk('mica', 'Mica', 'mineral', 'SHEETY', 'SILVER', '2', 'Peels apart into sheets thin enough to see through.'),
  mk('calcite', 'Calcite', 'mineral', 'CRYSTAL', 'MILKY WHITE', '3', 'Fizzes when a drop of weak acid touches it.'),
  mk('pyrite', 'Pyrite', 'mineral', 'CUBIC', 'BRASS GOLD', '6', 'Nicknamed fools gold, and it grows in perfect cubes.'),
  mk('galena', 'Galena', 'mineral', 'CUBIC', 'LEAD GREY', '3', 'Heavy and metallic, the main ore of lead.'),
  mk('malachite', 'Malachite', 'mineral', 'BANDED', 'GREEN', '4', 'Bright green bands show that it carries copper.'),
  mk('hematite', 'Hematite', 'mineral', 'EARTHY', 'RUST RED', '6', 'Leaves a red streak, and it is the main ore of iron.'),
  mk('gypsum', 'Gypsum', 'mineral', 'BLADED', 'PALE WHITE', '2', 'Soft enough to scratch with a fingernail, used in plaster.'),
  mk('fluorite', 'Fluorite', 'mineral', 'CUBIC', 'PURPLE GREEN', '4', 'Glows under ultraviolet light and comes in many colours.'),
];

export const ROCK_BY_ID: Record<string, Rock> = ROCKS.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<string, Rock>,
);

export function rocksOfType(type: RockType): Rock[] {
  return ROCKS.filter(r => r.type === type);
}
