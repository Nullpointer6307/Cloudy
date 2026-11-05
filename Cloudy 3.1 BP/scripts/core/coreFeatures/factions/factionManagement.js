import { world, Player } from '@minecraft/server'
import { addScore, getScore } from '../../../utility/scoreboards'
import { getItemCount, addItem, removeItems, getOpenSlots } from '../../../utility/inventory'
import { formatNumber } from '../../../utility/formating'

/**
 * Creates a new faction.
 *
 * @param {Player} player 
 * @param {string} facName 
 */
export function createFaction (player, facName) {
  const facObject = {
    name: facName,
    leader: player.name,
    members: [player.name],
    bank: 1234567,
    value: 0,
    claims: [],
    power: 5,
    powerMax: 10,
    tnt: 2240,
    homes: {
      home1: {name: 'home1', pos: {x: 0, y: 0, z: 0}},
      home2: {name: 'home2', pos: {x: 0, y: 0, z: 0}},
      home3: {name: 'home3', pos: {x: 0, y: 0, z: 0}},
      home4: {name: 'home4', pos: {x: 0, y: 0, z: 0}},
      home5: {name: 'home5', pos: {x: 0, y: 0, z: 0}}
    }
  }

  const playerId = player.name.toLowerCase()

  // update data
  world.setDynamicProperty(`fac_data_${facName}`, JSON.stringify(facObject))
  world.setDynamicProperty(`fac_${playerId}`, facName)
  player.setDynamicProperty('fac_name', `${facName}`)

  // message
  player.sendMessage(`§aFaction §b${facName} §acreated successfully!`)
}

/**
 * Gets the player's faction information.
 *
 * @param {Player} player
 * @returns {Object}
 */
export function getFacInfo (player) {
  return JSON.parse(world.getDynamicProperty(`fac_data_${player.getDynamicProperty('fac_name')}`))
}

/**
 * Updates the player's faction information.
 *
 * @param {Player} player
 * @param {Object} facInfo
 */
export function updateFacInfo (player, facInfo) {
  world.setDynamicProperty(`fac_data_${player.getDynamicProperty('fac_name')}`, JSON.stringify(facInfo))
}

/**
 * Leave a faction
 *
 * @param {Player} player
 */
export function leaveFaction (player) {
  const facName = player.getDynamicProperty('fac_name')
  const playerId = player.name.toLowerCase()
  const facInfo = JSON.parse(world.getDynamicProperty(`fac_data_${facName}`))

  if (facInfo.leader === player.name) {
    player.sendMessage('§cThe faction leader cannot leave the faction. Please transfer leadership or disband the faction.')
    return
  }

  // update data
  facInfo.members = facInfo.members.filter(member => member !== player.name)
  world.setDynamicProperty(`fac_${playerId}`, undefined)
  player.setDynamicProperty('fac_name', undefined)

  // message
  player.sendMessage(`§aFaction §b${facName} left successfully!`)
}

/**
 * Updates a faction home.
 *
 * @param {Player} player
 * @param {Object} home
 * @param {string} newHomeName
 * @param {boolean} updatePos
 */
export function updateFactionHome (player, home, newHomeName, updatePos) {
  const oldName = home.name
  const facInfo = getFacInfo(player)
  const key = Object.keys(facInfo.homes).find(k => facInfo.homes[k].name === oldName)

  // update home name if needed
  if (oldName != newHomeName) {
    facInfo.homes[key].name = newHomeName
    player.sendMessage(`§aFaction home ${oldName} renamed to ${newHomeName}`)
  }

  // update position if needed
  if (updatePos) {
    let newPos = player.location
    newPos = { x: Math.floor(newPos.x), y: Math.floor(newPos.y), z: Math.floor(newPos.z) }
    facInfo.homes[key].pos = newPos
    player.sendMessage(`§aFaction home ${newHomeName} position updated to §e(${newPos.x}, ${newPos.y}, ${newPos.z})`)
  }

  // update faction information
  updateFacInfo(player, facInfo)
}

/**
 * Deposits money into the faction bank.
 *
 * @param {Player} player
 * @param {number} amount
 */
export function depositBank (player, amount) {
  const facInfo = getFacInfo(player)
  const playerMoney = getScore(player, 'money')

  if (amount === 'all') amount = playerMoney

  // ensure player has enough money
  if (playerMoney < amount) {
    player.sendMessage(`§cYou do not have enough money`)
    return
  }

  // remove money from player
  addScore(player, 'money', -amount)

  // add money to fac bank
  facInfo.bank += amount
  updateFacInfo(player, facInfo)

  // send message
  player.sendMessage(`§eDeposited §a$${formatNumber(amount)} §einto your faction bank`)
}

/**
 * Withdraws money from the faction bank.
 *
 * @param {Player} player
 * @param {number} amount
 */
export function withdrawBank (player, amount) {
  const facInfo = getFacInfo(player)

  if (amount === 'all') amount = facInfo.bank

  // ensure fac bank has enough money
  if (facInfo.bank < amount) {
    player.sendMessage(`§cFaction bank does not have enough money`)
    return
  }

  // add money to player
  addScore(player, 'money', amount)

  // remove money from fac bank
  facInfo.bank -= amount
  updateFacInfo(player, facInfo)

  // send message
  player.sendMessage(`§eWithdrew §a$${formatNumber(amount)} §efrom your faction bank`)
}

/**
 * Deposits TNT into the faction storage.
 *
 * @param {Player} player
 * @param {number} amount
 */
export function depositTnt (player, amount) {
  const facInfo = getFacInfo(player)
  const playerTnt = getItemCount(player, 'minecraft:tnt')

  if (amount === 'all') amount = playerTnt

  if (playerTnt < amount) {
    player.sendMessage(`§cYou do not have enough TNT`)
    return
  }

  // remove TNT from player
  removeItems(player, 'minecraft:tnt', amount)

  // add TNT to fac storage
  facInfo.tnt += amount
  updateFacInfo(player, facInfo)

  // send message
  player.sendMessage(`§eDeposited §a${formatNumber(amount)} TNT §einto your faction warehouse`)
}

/**
 * Withdraws TNT from the faction storage.
 *
 * @param {Player} player
 * @param {number} amount
 */
export function withdrawTnt (player, amount) {
  const facInfo = getFacInfo(player)

  if (amount === 'all') {
    if (getOpenSlots(player) * 64 > facInfo.tnt) {
      amount = facInfo.tnt
    } else {
      amount = getOpenSlots(player) * 64
    }
  }

  if (amount > 32000) {
    player.sendMessage(`§cYou cannot withdraw more than 32,000 TNT at once`)
    return
  }

  if (facInfo.tnt < amount) {
    player.sendMessage(`§cYour faction does not have enough TNT`)
    return
  }

  // give player tnt
  try {
    addItem(player, 'minecraft:tnt', amount)
  } catch (error) {
    player.sendMessage(`§c${error.message}`)
    return
  }

  // remove TNT from fac storage
  facInfo.tnt -= amount
  updateFacInfo(player, facInfo)

  // send message
  player.sendMessage(`§eWithdrew §a${formatNumber(amount)} TNT §efrom your faction warehouse`)
}
