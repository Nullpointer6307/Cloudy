// checks for players entering a new chunk to update hud and change location 
// performance impact: unknown
// tick delay: 5

import { system, world } from '@minecraft/server'
import { enterChunk, getChunkFromPos, chunkBorder } from './claimtools'

const playerChunkMap = new Map()

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const currentChunk = getChunkFromPos(player.location)
    const playerId = player.id
    const lastChunk = playerChunkMap[playerId]

    // update chunk borders
    // if (player.hasTag('chunkBorder')) chunkBorder(player, currentChunk)

    if (lastChunk) {
      if (lastChunk.x == currentChunk.x && lastChunk.z == currentChunk.z) {
        continue
      }
    }

    playerChunkMap[playerId] = currentChunk
    enterChunk(player, currentChunk)
  }
}, 5)
