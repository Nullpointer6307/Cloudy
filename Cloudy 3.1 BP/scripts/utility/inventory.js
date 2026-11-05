import { ItemStack, Player } from '@minecraft/server'

/**
 * Returns the total count of a specific item in the player's inventory.
 * @param {Player} player - The player entity.
 * @param {string} itemId - The item identifier (e.g., "minecraft:diamond").
 * @returns {number} The total count of the item in the player's inventory.
 */
export function getItemCount (player, itemId) {
  let count = 0
  const inventory = player.getComponent('minecraft:inventory')
  if (!inventory) return
  const container = inventory.container
  for (let i = 0; i < container.size; i++) {
    const slot = container.getItem(i)
    if (slot && slot.typeId === itemId) {
      count += slot.amount
    }
  }
  return count
}

/**
 * Removes a given number of items from the player's inventory.
 * @param {Player} player - The player entity.
 * @param {string} itemId - The item identifier (e.g., "minecraft:diamond").
 * @param {number} amount - The number of items to remove.
 * @returns {number} The number of items actually removed.
 */
export function removeItems (player, itemId, amount) {
  player.runCommand(`clear @s ${itemId} 0 ${amount}`)
}

/**
 * Adds a given number of items to the player's inventory.
 * @param {Player} player - The player entity.
 * @param {string} itemId - The item identifier (e.g., "minecraft:diamond").
 * @param {number} amount - The number of items to add.
 */
export function addItem (player, itemId, amount) {
  const open = getOpenSlots(player)

  // catch giving too many items (minecraft does not handle this well and will delete items)
  if (amount > open * 64) throw new Error('Not enough inventory space')

  player.runCommand(`give @s ${itemId} ${amount}`)
}

export function getOpenSlots (player) {
  const inventory = player.getComponent('minecraft:inventory')
  if (!inventory) return 0
  const container = inventory.container
  let openSlots = 0
  for (let i = 0; i < container.size; i++) {
    const slot = container.getItem(i)
    if (!slot) {
      openSlots++
    }
  }
  return openSlots
}

/**
 * gives an item to the player with defined dynamic properties and name
 * 
 * @param {Player} player 
 * @param {ItemStack} item 
 */
export function addSpecialItem (player, item) {
  const inventory = player.getComponent('minecraft:inventory')
  if (!inventory) return 0
  const container = inventory.container
  for (let i = 0; i < container.size; i++) {
    const slot = container.getItem(i)
    if (!slot) {
      container.setItem(i, item)
      return
    }
  }

  // throw error if now open slots to give item
  throw new Error('Not enough inventory space')
}

/**
 * returns a list containing the player's inventory
 * 
 * @param {Player} player - the player to get the inventory of
 * @returns {Array} - an array of the items in the inventory
 */
export function getInventory (player) {
  const inventory = player.getComponent('minecraft:inventory')
  const container = inventory.container
  const ret = []

  for (let i = 0; i < container.size; i++) {
    const slot = container.getItem(i)
    if (!slot) {
      ret.push([undefined, '1'])
    }else {
      ret.push([slot.typeId, slot.amount])
    }
  }

  return ret
}
