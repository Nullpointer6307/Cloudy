import { Player } from '@minecraft/server'
import { getClaimOwner } from './claimManager'
import { getFacInfo } from '../factionManagement'

import { world, system } from '@minecraft/server'
import { claimChunk, unclaimChunk } from './UIs/claimMenu'

/**
 * get chunk cords from world cords
 * 
 * @param {Vector3} pos
 * @returns {Vector2}
 */
export function getChunkFromPos (pos) {
  return {
    x: Math.floor(pos.x * 0.0625),
    z: Math.floor(pos.z * 0.0625)
  }
}

/**
 * display and handle claim info on HUD
 * 
 * @param {Player} player 
 * @param {Vector2} chunk 
 */
export function enterChunk (player, chunk) {
  const claim = getClaimOwner(chunk)
  const facInfo = getFacInfo(player)

  // player in wild
  if (!claim) {
    if (player.getDynamicProperty('location') != 'wild') {
      player.setDynamicProperty('location', 'wild')
      player.onScreenDisplay.setActionBar(`§aEntering Wilderness \n§7Unclaimed Land`)

      // auto claim
      if (player.hasTag('autoClaim')) claimChunk(player)
    }
  }
  // player in own claim
  else if (claim == 'arena') {
    if (player.getDynamicProperty('location') != 'arena') {
      player.setDynamicProperty('location', 'arena')
      player.onScreenDisplay.setActionBar(`§bEntering Arena \n§7Ready your sword`)
    }
  }
  // player in spawn
  else if (claim == 'spawn') {
    if (player.getDynamicProperty('location') != 'spawn') {
      player.setDynamicProperty('location', 'spawn')
      player.onScreenDisplay.setActionBar(`§bEntering Spawn \n§7Welcome to Spawn!`)
    }
  }
  // player in own claim
  else if (claim == facInfo.name) {
    if (player.getDynamicProperty('location') != 'own_claim') {
      player.setDynamicProperty('location', 'own_claim')
      player.onScreenDisplay.setActionBar(`§eEntering Your Claim \n§7Welcome Home!`)

      // auto unclaim
      if (player.hasTag('autoUnclaim')) unclaimChunk(player)
    }
  }
  // player in enemy claim
  else {
    if (player.getDynamicProperty('location') != 'enemy_claim') {
      player.setDynamicProperty('location', 'enemy_claim')
      player.onScreenDisplay.setActionBar(`§cEntering Enemy Claim \n§7Owned by §e${claim}`)
    }
  }

  // update faction map
  if (player.hasTag('claimMap')) facMap(player, chunk)
}

/**
 * displays faction map for player
 * 
 * @param {Player} player 
 * @param {Vector2} chunk 
 */
export function facMap (player, chunk) {
  const radius = 10
  const facInfo = getFacInfo(player)
  const facName = facInfo.name
  let chunkMap = []

  // get claim data of surrounding chunks
  for (let dz = -radius; dz <= radius; dz++) {
    let row = ''
    for (let dx = -radius; dx <= radius; dx++) {
      const cx = chunk.x + dx
      const cz = chunk.z + dz
      const claim = world.getDynamicProperty(`claim${cx},${cz}`)
      if (claim) {
        row += claim == facName ? '§a-' : '§c-'
      } else {
        row += '§7-'
      }
    }
    chunkMap.push(row)
  }

  // set player postion in middile of map
  chunkMap[radius] = chunkMap[radius].match(/.{3}/g).map((v, i, a) => i === a.length >> 1 ? v.slice(0, 2) + '+' : v).join('')

  // display map to player

  // player.onScreenDisplay.setTitle("hello", {
  //   stayDuration: 100,
  //   fadeInDuration: 0,
  //   fadeOutDuration: 0,
  //   subtitle: chunkMap.join("\n")
  // })

  player.onScreenDisplay.setTitle('map:' + chunkMap.join('\n'), {
    stayDuration: 1000,
    fadeInDuration: 0,
    fadeOutDuration: 0
  })
}

/**
 * 
 * @param {Player} player 
 * @param {Vector2} chunk 
 */
export function chunkBorder (player, chunk) {
  const chunkCenter = {x: (chunk.x + 0.5) * 16, y: Math.floor(player.location.y * 0.0625) * 16, z: (chunk.z + 0.5) * 16}
  player.spawnParticle('cloudy:testMain', chunkCenter)
}
