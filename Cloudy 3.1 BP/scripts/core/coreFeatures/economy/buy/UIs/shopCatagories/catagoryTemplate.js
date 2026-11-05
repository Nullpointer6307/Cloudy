import { Player } from '@minecraft/server'
import { ChestFormData } from 'extensions/forms.js'
import { buyMenu } from '../buyMenu'
import { BuyItem } from '../buyTemplate'
import { formatMoney } from '../../../tools/money'

/**
 * handles UI for shop Menu
 *
 * @param {Player} player 
 */
export function catagoryTemplate (player, catagoryName, catagoryItems) {
  const catagoryMenu = new ChestFormData('large')
    .title(`${catagoryName}`)
    .button(4, `${catagoryName}`, ['§7Select an item to buy'], 'textures/items/paper')
    .button(45, `§aBack`, [], 'textures/items/arrow')

  catagoryItems.forEach((item, index) => {
    if (!item) {
      catagoryMenu.button(9 + index, '', [], 'textures/blocks/glass_gray', 1, 0, true)
    }else {
      const itemInfo = item[1]
      const price = itemInfo.price
      const texture = itemInfo.texture
      const displayName = itemInfo.name ? itemInfo.name : item[0].replace(/^.*?:/, '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
      catagoryMenu.button(9 + index, `§a[Buy] §e${displayName} §a${formatMoney(price)}`, [], `${texture}`)
    }
  })

  catagoryMenu.pattern([
    'xxxx_xxxx',
    '_________',
    '_________',
    '_________',
    '_________',
    '_xxxxxxxx'
  ], {
    x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
  })

  catagoryMenu.show(player).then(response => {
    if (response.canceled) return
    const selection = response.selection
    switch (true) {
      // buy item
      case selection >= 9 && selection <= 44:
        const index = selection - 9
        const itemName = catagoryItems[index][0]
        const itemInfo = catagoryItems[index][1]
        BuyItem(player, itemName, itemInfo, () => catagoryTemplate(player, catagoryName, catagoryItems))
        break
      // back button
      case selection === 45:
        buyMenu(player)
        break
    }
  })
}
