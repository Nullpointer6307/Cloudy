import { system, world } from '@minecraft/server'
import { armorEnchantments } from '../config'
import { getArmorEnchantments } from '../utils'

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const armorEnchants = getArmorEnchantments(player)
    for (const [piece, enchants] of Object.entries(armorEnchants)) {
      for (const [enchant, level] of Object.entries(enchants)) {
        if (enchant in armorEnchantments) {
          armorEnchantments[enchant](player, level, piece)
        }
      }
    }
  }
}, 20)
