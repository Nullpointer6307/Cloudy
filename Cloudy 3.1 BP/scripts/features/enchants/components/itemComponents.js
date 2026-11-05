import { world, system, Entity, StartupEvent } from '@minecraft/server'
import { BeforeEventManager } from 'eventManagers/beforeEventManager'

/**
 * Handles custom block components for spawner blocks
 *
 * @param {StartupEvent} data
 */
function tomeItemComponents (data) {
  data.itemComponentRegistry.registerCustomComponent('cloudy:tome', {
  })
}

// load functions into events
BeforeEventManager.register('startup', tomeItemComponents)
