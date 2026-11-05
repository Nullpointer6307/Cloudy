import { Player, Block } from '@minecraft/server'

/**
 * Breaks a spawner block and drops the appropriate items.
 * @param {Player} player - The player breaking the spawner.
 * @param {Dimension} dim - The dimension the spawner is in.
 * @param {Vector3} pos - The position of the spawner.
 * @param {int} level - The level of the spawner being broken.
 */
export function breakSpawner (player, type, dim, pos, level) {
  player.runCommand(`give @s ${type} ${level}`)
  // dim.getBlock(pos).setType('minecraft:air')
  player.playSound('block.mob_spawner.break', {
    location: pos
  })
}
