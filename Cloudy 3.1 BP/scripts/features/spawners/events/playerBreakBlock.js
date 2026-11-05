import { world, Player, Block, system } from '@minecraft/server'
import { breakSpawner } from '../break'
import { spawners } from '../config'

world.beforeEvents.playerBreakBlock.subscribe((data) => {
  const block = data.block
  const player = data.player

  if (spawners.includes(block.typeId)) {
    const level = block.permutation.getState('cloudy:level')
    const typeId = block.typeId

    // data.cancel = true

    system.run(() => {
      breakSpawner(player, typeId, block.dimension, block.location, level)
    })
  }
})
