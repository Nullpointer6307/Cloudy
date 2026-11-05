import { world, system, Entity, StartupEvent } from '@minecraft/server'
import { BeforeEventManager } from 'eventManagers/beforeEventManager'
import { MainMenuManager } from '../menuManager'

/**
 * Handles custom block components for spawner blocks
 *
 * @param {StartupEvent} data
 */
function mainMenuItemComponents (data) {
  data.itemComponentRegistry.registerCustomComponent('cloudy:mainMenu', {
    onUse: (data) => {
      const player = data.source
      MainMenuManager.init(player)
    }
  })
}

// load functions into events
BeforeEventManager.register('startup', mainMenuItemComponents)
