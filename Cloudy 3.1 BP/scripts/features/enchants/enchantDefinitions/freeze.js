import { InputPermissionCategory, Player, world, system } from '@minecraft/server'

/**
 * 
 * Controls Vampire enchant effects
 * 8% chance to heal the attacker for 2 health per enchant level on hit
 * 
 * @param {Player} attacker 
 * @param {Player} victim 
 * @param {Int} enchantLevel 
 */
export function freezeEnchant (attacker, victim, enchantLevel) {
  if (Math.random() < 0.05 * enchantLevel) {

    // stop victim from moving for 2 seconds
    victim.addEffect('minecraft:slowness', 40, {enchantLevel: 1, showParticles: false})
    victim.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false)
    system.runTimeout(() => victim.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true), 40)

    attacker.playSound('mob.player.hurt_freeze', { volume: 10, pitch: 1 })
    victim.playSound('mob.player.hurt_freeze', { volume: 10, pitch: 1 })

    // spawn snowflake particles
    let particle_locations = []
    for (let i = 0; i < 10; i++) {
      particle_locations.push({
        x: victim.location.x + (Math.random() - 0.5) * 2 - 0.5,
        y: victim.location.y - 1 + Math.random() * 2,
        z: victim.location.z + (Math.random() - 0.5) * 2 - 0.5
      })
    }
    for (const loc of particle_locations) {
      attacker.spawnParticle('minecraft:snowflake_particle', loc)
    }

    attacker.sendMessage(`§9Freeze §7slowed your enemy!`)
    victim.sendMessage(`§9Freeze §7slowed you!`)
  }
}
