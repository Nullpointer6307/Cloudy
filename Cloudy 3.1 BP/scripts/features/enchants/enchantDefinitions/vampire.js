import { Player, world } from '@minecraft/server'

/**
 * 
 * Controls Vampire enchant effects
 * 8% chance to heal the attacker for 2 health per enchant level on hit
 * 
 * @param {Player} attacker 
 * @param {Player} victim 
 * @param {Int} enchantLevel 
 */
export function vampireEnchant (attacker, victim, enchantLevel) {
  if (Math.random() < 0.08) {
    const healthComponent = attacker.getComponent('minecraft:health')

    if ((healthComponent.currentValue + 2 * enchantLevel) >= healthComponent.effectiveMax) {
      healthComponent.setCurrentValue(healthComponent.effectiveMax)
    } else {
      healthComponent.setCurrentValue(healthComponent.currentValue + 2 * enchantLevel)
    }
    attacker.playSound('random.drink_honey', { volume: 10, pitch: 1 })

    // spawn heart particles
    let particle_locations = []
    for (let i = 0; i < 3; i++) {
      particle_locations.push({
        x: attacker.location.x + (Math.random() - 0.5) * 2,
        y: attacker.location.y + Math.random() * 1.5,
        z: attacker.location.z + (Math.random() - 0.5) * 2
      })
    }
    for (const loc of particle_locations) {
      attacker.spawnParticle('minecraft:heart_particle', loc)
    }

    attacker.sendMessage(`§4Vampire §7healed you!`)
  }
}
