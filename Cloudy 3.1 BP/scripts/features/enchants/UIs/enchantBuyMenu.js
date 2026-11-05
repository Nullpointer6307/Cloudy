import { ItemStack, Player, world, EntityTypes, system } from '@minecraft/server'
import { ChestFormData } from 'extensions/forms.js'
import { weaponEnchantShopInfo, armorEnchantShopInfo, fancyNumbers } from '../config'
import { formatNumber } from 'utility/formating'
import { addSpecialItem } from 'utility/inventory'
import { removeExperience } from 'core/coreFeatures/economy/tools/experience'

/**
 * Custom enchant shop UI.
 *
 * @param {Player} player
 */
export function enchantBuyMenu (player) {
  const shopMenu = new ChestFormData('large')
    .title('§aBuy Enchants')
    .button(4, '§aBuy Menu', ['§7Select an option'], 'textures/items/paper')
    .button(45, '§aBack', [], 'textures/items/arrow')
    .button(20, '§a[Buy] §cWeapon Tome §a10,000§exp', ['§7Buy a tome with a random enchant for your sword'], 'textures/blocks/glass_red')
    .button(22, '§eYour XP: §a' + formatNumber(player.getTotalXp()), [], 'textures/items/experience_bottle')
    .button(24, '§a[Buy] §6Armor Tome §a10,000§exp', ['§7Buy a tome with a random enchant for your armor'], 'textures/blocks/glass_orange')

  shopMenu.pattern([
    'xxxx_xxxx',
    'x_______x',
    'x_______x',
    'x_______x',
    'x_______x',
    '_xxxxxxxx'
  ], {
    x: { itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black' }
  })

  shopMenu.show(player).then(response => {
    if (response.canceled) return
    switch (response.selection) {
      case 20:
        // insufficient xp
        if (player.getTotalXp() < 10000) {
          player.sendMessage('§cYou do not have enough XP to buy this tome!')
          player.playSound('note.bassattack')
          break
        }

        // buy random tome
        const weaponEnchants = Object.keys(weaponEnchantShopInfo)
        const chosenEncant = weaponEnchants[Math.floor(Math.random() * weaponEnchants.length)]
        const randomValue = Math.random()
        let level = 0
        if (randomValue > 0.55) {
          level = 1
        } else if (randomValue > 0.25) {
          level = 2
        } else if (randomValue > 0.14) {
          level = 3
        } else if (randomValue > 0.05) {
          level = 4
        } else {
          level = 5
        }
        let tome = new ItemStack('cloudy:tome', 1)
        tome.setDynamicProperty('enchant', chosenEncant)
        tome.setDynamicProperty('level', level)
        tome.setLore([weaponEnchantShopInfo[chosenEncant].displayName + ' ' + fancyNumbers[level]])

        try {
          addSpecialItem(player, tome)
          removeExperience(player, 10000)
          // reopen Menu
          enchantBuyMenu(player)
        } catch (e) {
          player.sendMessage(`§cNot enough inventory space!`)
          player.playSound('note.bassattack')
        }
        break
      case 45:
        MainMenuManager.init(player)
        break
    }
  })
}
