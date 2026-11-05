import { Player } from '@minecraft/server'
import { ChestFormData } from 'extensions/forms'
import { addItem } from 'utility/inventory'
import { addMoney, removeMoney, getMoney, formatMoney } from '../../tools/money'

/**
 * template UI for buying an item
 * 
 * @param {Player} player 
 * @param {String} itemName 
 * @param {Object} itemInfo 
 * @param {Function} returnMenu 
 */
export function BuyItem (player, itemName, itemInfo, returnMenu) {
  const displayName = itemInfo.name ? itemInfo.name : itemName.replace(/^.*?:/, '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  new ChestFormData('small')
    .title(`§gBuy Item`)
    .button(4, `§eBuy ${displayName}`, ['§7Select amount to buy'], `textures/items/paper`)
    .button(18, `§aBack`, [], 'textures/items/arrow')
    .button(22, `§eBalance: §a${formatMoney(getMoney(player))}`, [], 'textures/blocks/double_plant_sunflower_front')

    .button(10, `§b[x1] §e${displayName}`, [`§a${formatMoney(itemInfo.price)}`], itemInfo.texture, 1)
    .button(11, `§b[x10] §e${displayName}`, [`§a${formatMoney(itemInfo.price * 10)}`], itemInfo.texture, 10)
    .button(12, `§b[x32] §e${displayName}`, [`§a${formatMoney(itemInfo.price * 32)}`], itemInfo.texture, 32)
    .button(13, `§b[x64] §e${displayName}`, [`§a${formatMoney(itemInfo.price * 64)}`], itemInfo.texture, 64)
    .button(14, `§d[x2 Stack] §e${displayName}`, [`§a${formatMoney(itemInfo.price * 128)}`], itemInfo.texture, 2)
    .button(15, `§d[x5 Stack] §e${displayName}`, [`§a${formatMoney(itemInfo.price * 320)}`], itemInfo.texture, 5)
    .button(16, `§d[x10 Stack] §e${displayName}`, [`§a${formatMoney(itemInfo.price * 640)}`], itemInfo.texture, 10)

    .pattern([
      'xxxx_xxxx',
      'x_______x',
      '_xxx_xxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })
    .show(player).then(response => {
    if (response.canceled) return
    // mapping of selection -> item quantity
    const selectionMap = {
      10: 1,
      11: 10,
      12: 32,
      13: 64,
      14: 128,
      15: 320,
      16: 640
    }

    // back button
    if (response.selection === 18) {
      returnMenu.call()
      return
    }

    const qty = selectionMap[response.selection]
    if (!qty) return

    const cost = itemInfo.price * qty
    if (removeMoney(player, cost)) {
      try {
        addItem(player, itemName, qty)
        player.playSound('random.orb')
      } catch (e) {
        player.sendMessage(`§cNot enough inventory space!`)
        player.playSound('note.bassattack')
        addMoney(player, cost)
      }
    }
    // reopen the buy menu after attempt
    BuyItem(player, itemName, itemInfo, returnMenu)
  })
}
