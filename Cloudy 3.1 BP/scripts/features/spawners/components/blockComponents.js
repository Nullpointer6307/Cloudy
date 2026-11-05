import { world, system, Entity, StartupEvent } from '@minecraft/server'
import { BeforeEventManager } from 'eventManagers/beforeEventManager'
import { spawnerMobsConfig } from '../config'
import { updateMob } from '../updateMob'
import { spawnerMenu } from '../UIs/spawnerMenu'

/**
 * Handles custom block components for spawner blocks
 *
 * @param {StartupEvent} data
 */
function spawnerBlockComponents (data) {
  data.blockComponentRegistry.registerCustomComponent('cloudy:spawner', {
    onTick: (data) => {
      const block = data.block
      const pos = block.location
      const dim = world.getDimension('overworld')

      const mobType = spawnerMobsConfig[block.typeId.split(':')[1]]
      const spawnerTag = `${pos.x},${pos.y},${pos.z}`

      const existingMobs = dim.getEntities({
        type: mobType,
        location: pos,
        maxDistance: 50,
        tags: [spawnerTag]
      })

      const existingMobsCount = dim.getEntities({
        type: mobType,
        location: pos,
        maxDistance: 50
      })

      // summon new mob if no old one
      if (existingMobs.length === 0 && existingMobsCount.length < 20) {

        // get ranmdom location around spawner
        let dx
        do {
          dx = Math.floor(Math.random() * 5) - 2
        } while (dx === 0)
        let dz
        do {
          dz = Math.floor(Math.random() * 5) - 2
        } while (dz === 0)
        let dy = Math.floor(Math.random() * 5) - 2

        const spawnLocation = { x: pos.x + dx, y: pos.y + dy, z: pos.z + dz }

        // ensure spawn location is open
        if (dim.getBlock(spawnLocation).typeId != 'minecraft:air') return

        const mob = dim.spawnEntity(mobType, spawnLocation)
        mob.triggerEvent('cloudy:setfromspawner')
        mob.setProperty('cloudy:fromspawner', true)
        mob.addTag(spawnerTag)
        const level = block.permutation.getState('cloudy:level')
        mob.setDynamicProperty('stack', level)
        updateMob(mob)
      }
      // add to spawner's mob stack
      else if (existingMobs.length === 1) {
        const mob = existingMobs[0]
        const level = block.permutation.getState('cloudy:level')
        mob.setDynamicProperty('stack', mob.getDynamicProperty('stack') + level)
        updateMob(mob)
      }
      // add to random mob stack
      else if (existingMobsCount.length >= 20) {
        const rand = Math.floor(Math.random() * 19)
        const randMob = existingMobsCount[rand]
        const level = block.permutation.getState('cloudy:level')
        randMob.setDynamicProperty('stack', randMob.getDynamicProperty('stack') + level)
        updateMob(randMob)
      }
    },
    onPlace: (data) => {
      const block = data.block
      block.setPermutation(block.permutation.withState('cloudy:level', 1))
    },
    onPlayerInteract: (data) => {
      const block = data.block
      const player = data.player
      spawnerMenu(player, block)
    }
  })
}

// load functions into events
BeforeEventManager.register('startup', spawnerBlockComponents)
