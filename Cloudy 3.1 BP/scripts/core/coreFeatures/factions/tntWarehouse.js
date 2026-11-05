import { Container, ItemStack } from '@minecraft/server'
import { getItemCount } from '../../../utility/inventory'
import { getFacInfo, updateFacInfo } from './factionManagement'

/**
 * Loads dispensers within a certain radius of the player.
 * 
 * @param {Player} player - The player to load dispensers for.
 * @param {number} amount - The amount of TNT to load.
 * @param {number} radius - The radius to search for dispensers.
 */
export function loadDispensers (player, amount, radius) {
  const dim = player.dimension
  const center = player.location

  let facInfo = getFacInfo(player)
  const tntBudget = facInfo.tnt

  let addedTnt = 0
  let addedDispensers = 0

  const dispensers = []

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const x = Math.floor(center.x + dx)
        const y = Math.floor(center.y + dy)
        const z = Math.floor(center.z + dz)

        const block = dim.getBlock({ x, y, z})

        if (block && block.typeId === 'minecraft:dispenser') {
          dispensers.push(block)
        }
      }
    }
  }

  // calculate total amount of tnt to add
  let toAdd = 0
  for (const dispenser of dispensers) {
    toAdd += getTntNeeded(dispenser, amount)
  }

  // check if dispensers were found
  if (toAdd === 0) {
    player.sendMessage(`§cNo dispensers found`)
    return 0
  }

  // ensure fac has enough tnt
  if (tntBudget < toAdd) {
    player.sendMessage(`§cNot enough TNT in faction warehouse`)
    return 0
  }

  // add tnt to dispensers
  for (const dispenser of dispensers) {
    const add = setTnt(amount, dispenser)
    if (add > 0) addedDispensers++
    addedTnt += add
  }

  // dispensers already full
  if (addedDispensers == 0) {
    player.sendMessage(`§cAll dispensers are already have at least ${amount} TNT`)
    return 0
  }

  player.sendMessage(`§aAdded ${addedTnt} TNT across ${addedDispensers} dispensers`)

  // remove tnt from faction warehouse
  facInfo = getFacInfo(player)
  facInfo.tnt -= addedTnt
  updateFacInfo(player, facInfo)
}

function getTntNeeded (block, amount) {
  let tnt = 0
  const container = block.getComponent('minecraft:inventory').container
  for (let i = 0; i < container.size; i++) {
    const item = container.getSlot(i).getItem()

    if (!item) continue

    if (item.typeId === 'minecraft:tnt') {
      tnt += item.amount
    }
  }
  return Math.max(0, amount - tnt)
}

/**
 * Adds TNT to a dispenser's inventory.
 * 
 * @param {number} amount - The amount of TNT to add.
 * @param {Block} block - The dispenser block.
 * @return {number} The amount of TNT actually added.
 */
function setTnt (amount, block) {
  let tntSlots = 0
  let tnt = 0
  const container = block.getComponent('minecraft:inventory').container
  for (let i = 0; i < container.size; i++) {
    const item = container.getSlot(i).getItem()

    if (!item) {
      tntSlots++
      continue
    }

    if (item.typeId === 'minecraft:tnt') {
      tntSlots++
      tnt += item.amount
    }
  }

  const availableToAdd = (tntSlots * 64) - tnt
  const needToAdd = amount - tnt

  // dispenser already has enough TNT
  if (needToAdd < 1) {
    return 0
  } else {
    // ensure there is no overflow of tnt (tnt will just be deleted)
    if (availableToAdd < needToAdd) {
      addItem(container, availableToAdd, 'minecraft:tnt')
      return availableToAdd
    } else {
      addItem(container, needToAdd, 'minecraft:tnt')
      return needToAdd
    }
  }
}

/**
 * Adds an item to a container.
 * 
 * @param {Container} container 
 * @param {Number} amount 
 * @param {String} item 
 */
function addItem (container, amount, item) {
  while (amount > 64) {
    container.addItem(new ItemStack(item, 64))
    amount -= 64
  }
  container.addItem(new ItemStack(item, amount))
}

export function unloadDispensers (player, radius) {
  const dim = player.dimension
  const center = player.location

  const dispensers = []

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const x = Math.floor(center.x + dx)
        const y = Math.floor(center.y + dy)
        const z = Math.floor(center.z + dz)

        const block = dim.getBlock({ x, y, z})

        if (block && block.typeId === 'minecraft:dispenser') {
          dispensers.push(block)
        }
      }
    }
  }

  // check if dispensers were found
  if (dispensers.length === 0) {
    player.sendMessage(`§cNo dispensers found`)
    return 0
  }

  let totalUnloaded = 0

  for (const dispenser of dispensers) {
    const unloaded = removeTnt(dispenser)
    totalUnloaded += unloaded
  }

  player.sendMessage(`§aUnloaded ${totalUnloaded} TNT from ${dispensers.length} dispensers`)

  // add tnt to faction warehouse
  const facInfo = getFacInfo(player)
  facInfo.tnt += totalUnloaded
  updateFacInfo(player, facInfo)
}

function removeTnt (block) {
  let tntRemoved = 0
  const container = block.getComponent('minecraft:inventory').container
  for (let i = 0; i < container.size; i++) {
    const item = container.getSlot(i).getItem()

    // remove and count tnt
    if (item && item.typeId === 'minecraft:tnt') {
      tntRemoved += item.amount
      container.setItem(i, new ItemStack('minecraft:air', 1))
    }
  }
  return tntRemoved
}
