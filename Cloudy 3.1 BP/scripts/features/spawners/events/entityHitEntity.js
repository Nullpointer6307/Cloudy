import { world, system, EntityHitEntityAfterEvent } from '@minecraft/server'
import { AfterEventManager } from 'eventManagers/afterEventManager'
import { getScore, setScore, addScore } from 'utility/scoreboards'
import { updateMob } from '../updateMob'
import { mobs } from '../config'

// contains data to limit player mob kills per second
const mobSlowdown = new Map()

/**
 * Handles entity hit entity events for spawner mobs.
 *
 * @param {EntityHitEntityAfterEvent} data
 */
function spawnerEntityHitEntity (data) {
  const entity = data.hitEntity
  const player = data.damagingEntity
  const mobType = entity.typeId

  if (mobs.includes(mobType) && entity.isValid && !entity.hasTag('temp')) {
    if (mobSlowdown.has(player.id)) return

    // handle mob kill slowdown
    mobSlowdown.set(player.id, true)
    system.runTimeout(() => mobSlowdown.delete(player.id), 4)

    // spawn and kill normal chicken for the loot
    let tempEntity = player.dimension.spawnEntity(mobType, entity.location)
    tempEntity.addTag('temp')
    tempEntity.applyDamage(1000, {
      damagingEntity: player,
      cause: 'entityAttack'
    })

    // decrease mob stack size
    const stack = entity.getDynamicProperty('stack')
    if (stack < 2) {
      entity.remove()
    } else {
      entity.setDynamicProperty('stack', stack - 1)
      updateMob(entity)
    }
  }
}

// load functions into events
AfterEventManager.register('entityhitentity', spawnerEntityHitEntity)
