import { Player, EquipmentSlot } from '@minecraft/server'

/**
 * 
 * @param {Player} player 
 * @returns {Array} array of Dynamic Property IDs and their values (can contain non enchantment properties)
 */
export function getWeaponEnchantments (player) {
  const inventory = player.getComponent('minecraft:inventory')
  const container = inventory.container

  const item = container.getItem(player.selectedSlotIndex)

  if (item == null) return {}

  return Object.fromEntries(item.getDynamicPropertyIds().map(p => [p, item.getDynamicProperty(p)]))
}

/**
 * 
 * @param {Player} player 
 * @returns {Object} Collection of Dynamic Property IDs and their values for each item (can contain non enchantment properties)
 */
export function getArmorEnchantments (player) {
  const equipment = player.getComponent('minecraft:equippable')
  const helmet = equipment.getEquipment(EquipmentSlot.Head)
  const chestplate = equipment.getEquipment(EquipmentSlot.Chest)
  const leggings = equipment.getEquipment(EquipmentSlot.Legs)
  const boots = equipment.getEquipment(EquipmentSlot.Feet)

  return {
    head: helmet ? Object.fromEntries(helmet.getDynamicPropertyIds().map(p => [p, helmet.getDynamicProperty(p)])) : {},
    chest: chestplate ? Object.fromEntries(chestplate.getDynamicPropertyIds().map(p => [p, chestplate.getDynamicProperty(p)])) : {},
    legs: leggings ? Object.fromEntries(leggings.getDynamicPropertyIds().map(p => [p, leggings.getDynamicProperty(p)])) : {},
    feet: boots ? Object.fromEntries(boots.getDynamicPropertyIds().map(p => [p, boots.getDynamicProperty(p)])) : {}
  }
}
