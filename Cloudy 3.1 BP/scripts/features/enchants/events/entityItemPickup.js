import { world } from '@minecraft/server'

world.beforeEvents.entityItemPickup.subscribe((data) => {
  const item = data.item
  if (item.hasTag('animation')) data.cancel = true
})
