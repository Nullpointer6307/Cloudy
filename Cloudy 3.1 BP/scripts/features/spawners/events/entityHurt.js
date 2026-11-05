import { world, system, EntityHurtAfterEvent } from '@minecraft/server'
import { AfterEventManager } from 'eventManagers/afterEventManager'
import { updateMob } from '../updateMob'
import { mobs } from '../config'

/**
 * Handles entity hurt events for spawner mobs.
 *
 * @param {EntityHurtAfterEvent} data
 */
function spawnerEntityHurt (data) {
  const entity = data.hurtEntity
  const mobType = entity.typeId

  if (mobs.includes(mobType) && entity.isValid && !entity.hasTag('temp')) {
    // drop loot
    let tempentity = entity.dimension.spawnEntity(mobType, entity.location)
    tempentity.addTag('temp')
    tempentity.applyDamage(1000)
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
AfterEventManager.register('entityhurt', spawnerEntityHurt)
