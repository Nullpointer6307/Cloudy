import { world, system, Player } from '@minecraft/server'
import { ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { ChestFormData } from 'extensions/forms.js'
import { getInventory } from 'utility/inventory'
import { sellItems } from '../config'
import { mainMenu } from '../../../../../UIs/mainMenu'
import { MainMenuManager } from '../../../mainMenu/menuManager'
import { sellAllItems, sellItem } from '../sellFunctions'

/**
 * handles UI for sell menu
 * 
 * @param {Player} player 
 */
export function sellMenu (player) {
  const inventory = getInventory(player)
  inventory.push(...inventory.splice(0, 9))

  const sellMenu = new ChestFormData('large')
    .title('§aSell')
    .button(4, '§aSell Menu', ['§7Click on an item to sell'], 'textures/items/paper')
    .button(49, '§aSell All', ['§7Click to sell all items'], 'textures/blocks/emerald_block')
    .button(45, `§aBack`, [], 'textures/items/arrow')
    .pattern([
      'xxxx_xxxx',
      '_________',
      '_________',
      '_________',
      '_________',
      '_xxx_xxxx'
    ], {
      x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
    })

  // create buttons for each item in player's inventory
  for (let i = 0; i < inventory.length; i++) {
    const item = inventory[i]

    // open inventory space
    if (!item[0]) {
      sellMenu.button(9 + i, ``, [], `textures/blocks/glass_silver`)
    }
    // item not sellable
    else if (!(item[0] in sellItems)) {
      sellMenu.button(9 + i, `§cNot Sellable`, [], `textures/blocks/barrier`)
    }
    // item can sellable
    else {
      const name = item[0]
      const amount = item[1]
      const price = sellItems[name].price
      const texture = sellItems[name].texture
      sellMenu.button(9 + i, `§e${name.replace('minecraft:', '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())} §a$${amount * price}`, [], `${texture}`, amount)
    }
  }

  sellMenu.show(player).then(response => {
    if (response.canceled) return
    const selection = response.selection
    switch (true) {
      // sell item
      case selection >= 9 && selection <= 44:
        sell(player, selection)
        break
      // back button
      case selection == 45:
        MainMenuManager.init(player)
        break
      // sell all button
      case selection == 49:
        sellAll(player)
    }
  })
}

function sell (player, selection) {
  const index = selection > 35 ? selection - 36 : selection

  const container = player.getComponent('minecraft:inventory').container
  const item = container.getItem(index)

  if (item == undefined || !(item.typeId in sellItems)) {
    sellMenu(player)
    player.playSound('note.bassattack')
  }else {
    sellItem(player, index)
    sellMenu(player)
  }
}

function sellAll (player) {
  sellAllItems(player)
}
