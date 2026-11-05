import { testEnchant } from './enchantDefinitions/testEnchant'
import { vampireEnchant } from './enchantDefinitions/vampire'
import { freezeEnchant } from './enchantDefinitions/freeze'
import { neptuneEnchant } from './enchantDefinitions/neptune'
import { feastEnchant } from './enchantDefinitions/feast'
import { blazeEnchant } from './enchantDefinitions/blaze'
import { breezeEnchant } from './enchantDefinitions/breeze'

export const weaponEnchantments = {
  testEnchant: testEnchant,
  vampire: vampireEnchant,
  freeze: freezeEnchant
}

export const armorEnchantments = {
  neptune: neptuneEnchant,
  feast: feastEnchant,
  blaze: blazeEnchant,
  breeze: breezeEnchant
}

// maxLevel is not used for now, but will be used to give a random level in its range in the shop
// rarity is meaningless for now but will be used in the future to determine the odds of getting certain enchants in the shop
export const weaponEnchantShopInfo = {
  vampire: {displayName: '§4Vampire', maxLevel: 5, rarity: 5},
  freeze: {displayName: '§bFreeze', maxLevel: 5, rarity: 5}
}

// can only handle max Level of 1, update level randomizer if this changes
// rarity is meaningless for now but will be used in the future to determine the odds of getting certain enchants in the shop
export const armorEnchantShopInfo = {
  neptune: {displayName: '§3Neptune', maxLevel: 1, rarity: 5},
  feast: {displayName: '§gFeast', maxLevel: 1, rarity: 5},
  blaze: {displayName: '§6Blaze', maxLevel: 1, rarity: 5},
  breeze: {displayName: '§aBreeze', maxLevel: 1, rarity: 5}
}

export const fancyNumbers = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: 'XI',
  12: 'XII',
  13: 'XIII',
  14: 'XIV',
  15: 'XV',
  16: 'XVI',
  17: 'XVII',
  18: 'XVIII',
  19: 'XIX'
}
