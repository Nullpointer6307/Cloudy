import { world, system, PlayerPlaceBlockAfterEvent } from '@minecraft/server'
import { getClaimOwner } from '../claimManager'
import { getChunkFromPos } from '../claimtools'

/**
 * handles playerPlaceBlock Event for claims
 * 
 * @param {PlayerPlaceBlockAfterEvent} data
 */
world.beforeEvents.playerPlaceBlock.subscribe((data) => {
  const player = data.player

  if (player.getGameMode() == 'Creative') return

  const block = data.block
  const chunk = getChunkFromPos(block.location)
  const facName = player.getDynamicProperty('fac_name')

  const claim = getClaimOwner(chunk)

  if (!claim) return

  // in server location
  if (claim == 'spawn' || claim == 'arena') {
    data.cancel = true
    player.sendMessage('§cYou cannot do that here!')
  }

  // enemy claim
  if (claim != facName) {
    data.cancel = true
    player.sendMessage('§cYou cannot place blocks in enemy claims!')
  }
})
