import { Player } from '@minecraft/server'

/**
 * 
 * Controls Feast enchant effects
 * Gives wearer saturation for 5 seconds
 * Chestplate
 * 
 * @param {Player} wearer
 * @param {Int} enchantLevel 
 * @param {String} piece - The armor piece that has the enchantment
 */
export function feastEnchant (wearer, enchantLevel, piece) {
  if (piece != 'chest') return
  wearer.addEffect('minecraft:saturation', 100, {enchantLevel: enchantLevel, showParticles: false})
}
