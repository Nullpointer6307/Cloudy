import { Player } from '@minecraft/server'

/**
 * 
 * Controls blaze enchant effects
 * Gives wearer fire res for 5 seconds
 * leggings
 * 
 * @param {Player} wearer
 * @param {Int} enchantLevel 
 * @param {String} piece - The armor piece that has the enchantment
 */
export function blazeEnchant (wearer, enchantLevel, piece) {
  if (piece != 'legs') return
  wearer.addEffect('minecraft:fire_resistance', 100, {enchantLevel: enchantLevel, showParticles: false})
}
