import { Player } from '@minecraft/server'

/**
 * 
 * Controls Breeze enchant effects
 * Gives wearer speed for 5 seconds
 * boots
 * 
 * @param {Player} wearer
 * @param {Int} enchantLevel 
 * @param {String} piece - The armor piece that has the enchantment
 */
export function breezeEnchant (wearer, enchantLevel, piece) {
  if (piece != 'feet') return
  wearer.runCommand(`effect @s speed 5 ${enchantLevel} true`) // using command for speed since the effect is weird with the player.addEffect method
}
