import { world, system, ItemStack, Player } from '@minecraft/server'
import { sellItems } from './config'
import { addMoney } from '../tools/money'
import { removeItems } from '../../../../utility/inventory'

/**
 * sells item from player's inventory
 * 
 * @param {Player} player - the player that is selling an item
 * @param {Int} index - the index of the item being sold
 */
export function sellItem (player, index) {
  const container = player.getComponent('minecraft:inventory').container
  const item = container.getItem(index)

  if (!item) return

  const itemName = item.typeId.replace('minecraft:', '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  const amount = item.amount
  const totalPrice = sellItems[item.typeId].price * amount

  player.sendMessage(`§eSold §bx${amount} §e${itemName} for §a$${totalPrice}`)
  addMoney(player, totalPrice)
  player.playSound('random.orb')

  container.setItem(index, undefined)
}

/**
 * sells all items in player's inventory
 * 
 * @param {Player} player 
 */
export function sellAllItems (player) {
  const container = player.getComponent('minecraft:inventory').container
  const selling = new Map()

  for (let i = 0; i < container.size; i++) {
    const slot = container.getItem(i)
    if (slot != undefined && slot.typeId in sellItems) {
      selling.set(slot.typeId, (selling.get(slot.typeId) || 0) + slot.amount)
    }
  }

  for (const [item, amount] of selling) {
    const itemName = item.replace('minecraft:', '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    const totalPrice = sellItems[item].price * amount

    removeItems(player, item, amount)
    player.sendMessage(`§eSold §bx${amount} §e${itemName} for §a$${totalPrice}`)
    addMoney(player, totalPrice)
  }
  player.playSound('random.orb')
}
