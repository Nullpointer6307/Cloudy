import { world, system, Player } from '@minecraft/server'
import { ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { ChestFormData } from 'extensions/forms.js'
import { getFacInfo, updateFacInfo } from '../../factionManagement'
import { factionsMenu } from '../../UIs/factionsMenu'
import { getClaimOwner } from '../claimManager'
import { enterChunk, getChunkFromPos } from '../claimtools'

/**
 * handles UI for claim menu
 * 
 * @param {Player} player 
 */
export function claimMenu (player) {
  const facInfo = getFacInfo(player)

  new ChestFormData('large')
    .title('§aClaims')
    .button(4, '§aClaims', ["§7This is where you can manage your faction's claims"], 'textures/items/paper')
    .button(22, `§bFaction Power §a${facInfo.power}§e/${facInfo.powerMax}`, ['§7Used for claiming more chunks'], 'textures/blocks/diamond_block')
    .button(29, `§aClaim Chunk`, ['§7Claim the chunk you are in'], 'textures/blocks/glass_green')
    .button(30, `§aUnclaim Chunk`, ['§7Unclaim the chunk you are in'], 'textures/blocks/glass_red')
    .button(31, `§aView Claims`, ["§7View all of your faction's claims"], 'textures/blocks/glass_orange')
    .button(32, `§aAuto Claim`, ['§7Adjust autoclaim settings'], 'textures/blocks/glass_blue')
    .button(33, `§eClaim Map ${player.hasTag('claimMap') ? '§aON' : '§cOFF'} §8(/f map)`, ['§7Toggle claim mini-map'], 'textures/blocks/glass_purple')
    .button(45, `§aBack`, [], 'textures/items/arrow')

    .pattern([
      'xxxx_xxxx',
      'x_______x',
      'x_______x',
      'x_______x',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 29:
        claimChunk(player)
        break
      case 30:
        unclaimChunk(player)
        break
      case 31:
        viewClaims(player)
        break
      case 32:
        autoclaimMenu(player)
        break
      case 33:
        toggleClaimMap(player)
        break
      case 45:
        factionsMenu(player)
    }
  })
}

/**
 * handles UI for auto claim menu
 * 
 * @param {Player} player 
 */
function autoclaimMenu (player) {
  new ChestFormData('small')
    .title('§aAuto Claim')
    .button(4, '§aAuto Claim', ['§7Toggle auto claim or unclaim'], 'textures/items/paper')
    .button(11, `§aToggle Auto Claim`, [], 'textures/blocks/glass_green')
    .button(13, `§bCurrent Status`, [`§eAuto Claim: ${player.hasTag('autoClaim') ? '§aON' : '§cOFF'}`, `${"§eAuto Unclaim: "} ${player.hasTag('autoUnclaim') ? '§aON' : '§cOFF'}`], 'textures/blocks/diamond_block')
    .button(15, `§cToggle Auto Unclaim`, [], 'textures/blocks/glass_red')
    .button(18, `Back`, [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      'x_______x',
      '_xxxxxxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 11:
        toggleAutoClaim(player)
        break
      case 15:
        toggleAutoUnclaim(player)
        break
      case 18:
        claimMenu(player)
        break
    }
  })
}

/**
 * toggles auto claim
 * 
 * @param {Player} player
 */
function toggleAutoClaim (player) {
  const toggleClaim = player.hasTag('autoClaim')
  const toggleUnclaim = player.hasTag('autoUnclaim')

  // toggle auto claim
  if (toggleClaim) {
    player.removeTag('autoClaim')
    player.sendMessage('§eAuto Claim toggled §cOFF')
  } else if (toggleUnclaim) {
    player.removeTag('autoUnclaim')
    player.sendMessage('§eAuto Unclaim toggled §cOFF')
    player.addTag('autoClaim')
    player.sendMessage('§eAuto Claim toggled §aON')
    claimChunk(player)
  } else {
    player.addTag('autoClaim')
    player.sendMessage('§eAuto Claim toggled §aON')
    claimChunk(player)
  }
}

/**
 * toggles auto unclaim
 * 
 * @param {Player} player
 */
function toggleAutoUnclaim (player) {
  const toggleClaim = player.hasTag('autoClaim')
  const toggleUnclaim = player.hasTag('autoUnclaim')

  // toggle auto claim
  if (toggleUnclaim) {
    player.removeTag('autoUnclaim')
    player.sendMessage('§eAuto Unclaim toggled §cOFF')
  } else if (toggleClaim) {
    player.removeTag('autoClaim')
    player.sendMessage('§eAuto Claim toggled §cOFF')
    player.addTag('autoUnclaim')
    player.sendMessage('§eAuto Unclaim toggled §aON')
    unclaimChunk(player)
  } else {
    player.addTag('autoUnclaim')
    player.sendMessage('§eAuto Unclaim toggled §aON')
    unclaimChunk(player)
  }
}

/**
 * claims chunk for player's faction if allowed
 * 
 * @param {Player} player
 */
export function claimChunk (player) {
  const facInfo = getFacInfo(player)
  const chunk = getChunkFromPos(player.location)
  let claim = getClaimOwner(chunk)

  // chunk can be claimed
  if (!claim) {

    // fac not enough power
    if (facInfo.claims.length >= facInfo.power) {
      player.sendMessage('§cFaction does not have enough power to claim this chunk')
      return
    }

    // claim chunk
    facInfo.claims.push(chunk) // update facinfo
    updateFacInfo(player, facInfo)
    world.setDynamicProperty(`claim${chunk.x},${chunk.z}`, facInfo.name) // update world claims

    // update player's location
    enterChunk(player, chunk)

    // success message
    player.sendMessage(`§eClaim placed at chunk cords: §a${chunk.x}, ${chunk.z}`)
    return
  }

  // player in already claimed chunk
  player.sendMessage('§cChunk already claimed')
  return
}

/**
 * unclaims chunk for player's faction if allowed
 * 
 * @param {Player} player 
 */
export function unclaimChunk (player) {
  const facInfo = getFacInfo(player)
  const chunk = getChunkFromPos(player.location)
  const claim = getClaimOwner(chunk)

  // player doesn't own chunk
  if (!claim || claim != facInfo.name) {
    player.sendMessage('§cYou do not own this chunk')
    return
  }

  // unclaim chunk
  facInfo.claims = facInfo.claims.filter(obj => !(obj.x === chunk.x && obj.z === chunk.z))
  updateFacInfo(player, facInfo)
  world.setDynamicProperty(`claim${chunk.x},${chunk.z}`, undefined)

  // update player's location
  enterChunk(player, chunk)

  // success message
  player.sendMessage(`§eClaim removed at chunk cords:§a ${chunk.x}, ${chunk.z}`)
}

/**
 * display faction claims to player
 * 
 * @param {Player} player 
 */
function viewClaims (player) {
  const facInfo = getFacInfo(player)
  const claims = facInfo.claims
  const name = facInfo.name

  player.sendMessage(`§b${name}§e's Claims: §7[${claims.length}]`)

  for (const claim of claims) {
    player.sendMessage(`§e${claim.x}, ${claim.z}`)
  }
  player.sendMessage('§7positions shown in chunk cords')
}

/**
 * toggles fac map to show
 * 
 * @param {Player} player 
 */
function toggleClaimMap (player) {
  const toggle = player.hasTag('claimMap')
  if (toggle) {
    player.removeTag('claimMap')
    player.sendMessage('§eClaim Map toggled §cOFF')
  }else {
    player.addTag('claimMap')
    player.sendMessage('§eClaim Map toggled §aON')
  }
}
