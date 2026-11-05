import { world } from '@minecraft/server'

/**
 * set claim at chunk cords
 * 
 * @param {Vector2} pos chunk cords
 * @param {String} name faction name
 */
export function setClaim (pos, name) {
  world.setDynamicProperty(`claim${pos.x},${pos.z}`, name)
}

/**
 * removes claim at chunk cords
 * 
 * @param {Vector2} pos chunck cords
 */
export function removeClaim (pos) {
  world.setDynamicProperty(`claim${pos.x},${pos.z}`, undefined)
}

/**
 * gets name of faction that claimed the chunk
 * 
 * @param {Vecotr2} pos chunk cords
 * @returns {String || undefined} faction name or undefined if not claimed
 */
export function getClaimOwner (pos) {
  return world.getDynamicProperty(`claim${pos.x},${pos.z}`)
}
