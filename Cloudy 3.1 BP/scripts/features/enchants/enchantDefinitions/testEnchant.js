import { Player, world } from '@minecraft/server'

/**
 * 
 * @param {Player} attacker 
 * @param {Player} victim 
 * @param {Int} enchantLevel 
 */
export function testEnchant (attacker, victim, enchantLevel) {
  // world.sendMessage(`${attacker.name} triggered Test Enchant on ${victim.name} at level ${enchantLevel}`)
  if (Math.random() < 0.1 * enchantLevel) {
    victim.runCommand(`summon lightning_bolt ${victim.location.x} ${victim.location.y} ${victim.location.z}`)
    // attacker.sendMessage(`Smited ${victim.name} with lightning!`)
  }
}
