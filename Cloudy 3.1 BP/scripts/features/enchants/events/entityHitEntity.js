import { world, system, EntityHitEntityAfterEvent } from '@minecraft/server'
import { AfterEventManager } from 'eventManagers/afterEventManager'
import { getScore, setScore, addScore } from 'utility/scoreboards'
import { getArmorEnchantments, getWeaponEnchantments } from '../utils'
import { weaponEnchantments } from '../config'

// contains data to limit enchant procs per second
const enchantSlowdown = new Map()

/**
 * Handles entity hit entity events for custom enchants.
 *
 * @param {EntityHitEntityAfterEvent} data
 */
function enchantsEntityHitEntity (data) {
  const attacker = data.damagingEntity
  const victim = data.hitEntity

  // only trigger on pvp
  if (attacker.typeId != 'minecraft:player' || victim.typeId != 'minecraft:player') return

  // handle enchantment proc slowdown
  if (enchantSlowdown.has(attacker.id)) return
  enchantSlowdown.set(attacker.id, true)
  system.runTimeout(() => enchantSlowdown.delete(attacker.id), 6)

  const attackerEnchants = getWeaponEnchantments(attacker)
  const victimEnchants = getArmorEnchantments(victim)

  for (const [enchant, encahntLevel] of Object.entries(attackerEnchants)) {

    // proc weapon enchantments
    if (enchant in weaponEnchantments) {
      weaponEnchantments[enchant](attacker, victim, encahntLevel)
    }
  }

// attacker.sendMessage(`You hit ${victim.name}`)
// victim.sendMessage(`You were hit by ${attacker.name}`)
}

// load functions into events
AfterEventManager.register('entityhitentity', enchantsEntityHitEntity)
