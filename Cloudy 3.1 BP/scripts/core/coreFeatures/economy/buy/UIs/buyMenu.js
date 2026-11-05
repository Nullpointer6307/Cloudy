import { world, system, Player } from '@minecraft/server'
import { ModalFormData, MessageFormData } from '@minecraft/server-ui'
import { ChestFormData } from 'extensions/forms.js'
import { getInventory } from 'utility/inventory'
import { mainMenu } from '../../../../../UIs/mainMenu'
import { MainMenuManager } from '../../../mainMenu/menuManager'
import { catagoryTemplate } from './shopCatagories/catagoryTemplate.js'
import * as buyItems from '../config.js'

/**
 * handles UI for sell menu
 * 
 * @param {Player} player 
 */
export function buyMenu (player) {
  const inventory = getInventory(player)
  inventory.push(...inventory.splice(0, 9))

  const sellMenu = new ChestFormData('large')
    .title('§eShop')
    .button(4, '§eShop', ['§7Select a shop category'], 'textures/items/paper')
    .button(45, `§aBack`, [], 'textures/items/arrow')
    .button(20, `§aNature`, [], 'textures/blocks/glass_lime')
    .button(21, `§aBlocks`, [], 'textures/blocks/glass_blue')
    .button(22, `§aColor Blocks`, [], 'textures/blocks/glass_yellow')
    .button(23, `§aBase Blocks`, [], 'textures/blocks/glass_purple')
    .button(24, `§aNether Blocks`, [], 'textures/blocks/glass_red')
    .button(25, `§aFarming`, [], 'textures/blocks/glass_green')
    .button(28, `§aSpawners`, [], 'textures/blocks/glass_black')
    .button(29, `§aGear`, [], 'textures/blocks/glass_gray')
    .button(30, `§aBrewing`, [], 'textures/blocks/glass_white')
    .button(31, `§aRedstone`, [], 'textures/blocks/glass_red')
    .button(32, `§aMisc`, [], 'textures/blocks/glass_light_blue')
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

  sellMenu.show(player).then(response => {
    if (response.canceled) return
    const selection = response.selection
    switch (true) {
      // back button
      case selection === 45:
        MainMenuManager.init(player)
        break
      // nature catagory
      case selection === 20:
        catagoryTemplate(player, '§aNature', buyItems.natureCatagoryItems)
        break
      // blocks catagory
      case selection === 21:
        catagoryTemplate(player, '§aBlocks', buyItems.blocksCatagoryItems)
        break
      // color blocks catagory
      case selection === 22:
        catagoryTemplate(player, '§aColor Blocks', buyItems.colorCatagoryItems)
        break
      // base blocks catagory
      case selection === 23:
        catagoryTemplate(player, '§aBase Blocks', buyItems.baseCatagoryItems)
        break
      // nether blocks catagory
      case selection === 24:
        catagoryTemplate(player, '§aNether Blocks', buyItems.netherCatagoryItems)
        break
      // farming catagory
      case selection === 25:
        catagoryTemplate(player, '§aFarming', buyItems.farmingCatagoryItems)
        break
      // farming catagory
      case selection === 25:
        catagoryTemplate(player, '§aFarming', buyItems.farmingCatagoryItems)
        break
      // spawner catagory
      case selection === 28:
        catagoryTemplate(player, '§aSpawners', buyItems.spawnerCatagoryItems)
        break
      // gear catagory
      case selection === 29:
        catagoryTemplate(player, '§aGear', buyItems.gearCatagoryItems)
        break
      // brewing catagory
      case selection === 30:
        catagoryTemplate(player, '§aBrewing', buyItems.brewingCatagoryItems)
        break
      // redstone catagory
      case selection === 31:
        catagoryTemplate(player, '§aRedstone', buyItems.redstoneCatagoryItems)
        break
      // misc catagory
      case selection === 32:
        catagoryTemplate(player, '§aMisc', buyItems.miscCatagoryItems)
        break
    }
  })
}
