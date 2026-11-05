import { Player } from '@minecraft/server'

/**
 * 
 * Controls Neptune enchant effects
 * Gives wearer conduit power effect for 12 seconds
 * Helmet
 * 
 * @param {Player} wearer
 * @param {Int} enchantLevel 
 * @param {String} piece - The armor piece that has the enchantment
 */
export function neptuneEnchant (wearer, enchantLevel, piece) {
  if (piece != 'head') return
  wearer.addEffect('minecraft:conduit_power', 260, {enchantLevel: enchantLevel, showParticles: false})
}
