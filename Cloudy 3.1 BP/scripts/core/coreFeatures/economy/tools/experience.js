import { Player } from '@minecraft/server'

/**
 * add experience to a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function addExperience (player, amount) {
  player.addExperience(amount)
}

/**
 * remove experience from a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function removeExperience (player, amount) {
  const currentXp = player.getTotalXp()
  player.addLevels(-(2 ** 24))
  player.addExperience(-(2 ** 24))
  player.addExperience(currentXp - amount)
}

/**
 * get the current experience of a player
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function getExperience (player) {
  return player.getTotalXp()
}
