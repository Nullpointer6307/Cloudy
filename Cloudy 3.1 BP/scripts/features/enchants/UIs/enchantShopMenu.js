import { ItemStack, Player, world, EntityTypes, system } from '@minecraft/server'
import { ChestFormData } from 'extensions/forms.js'
import { BuyItem } from '../../../core/coreFeatures/economy/buy/UIs/buyTemplate'
import { formatMoney } from '../../../core/coreFeatures/economy/tools/money'
import { MainMenuManager } from '../../../core/coreFeatures/mainMenu/menuManager'
import { enchantBuyMenu } from './enchantBuyMenu'


import { addSpecialItem } from 'utility/inventory'

/**
 * experimenting
 *
 * @param {Player} player
 */
function experimenting (player) {

  // experimenting
  let item0 = new ItemStack('cloudy:tome', 1)
  item0.setDynamicProperty('enchant', 'vampire')
  item0.nameTag = '§bEnchanted Tome'
  item0.add
  item0.setLore(['§4Vampire 1'])
  addSpecialItem(player, item0)

  const item1 = player.dimension.spawnItem(new ItemStack('cloudy:tome', 1), {x: 46.5, y: 102, z: 22.5})
  const item2 = player.dimension.spawnItem(new ItemStack('minecraft:netherite_sword', 1), {x: 46.5, y: 102, z: 22.5})

  item1.addTag('animation');
  item2.addTag('animation');

  let origin = { ...item1.location };
  origin.y += 3;

  let theta = 0;
  let omega = 0.06;

  let baseAcceleration = 0.0025;
  let acceleration = baseAcceleration;

  let maxOmega = 1.2;

  let radius = 3;
  let shrinking = false;

  let maxSteps = 240;
  let step = 0;

  // ---- Sound System ----
  let soundTickCounter = 0;
  let minInterval = 2;    // fastest sound interval
  let maxInterval = 12;   // slow start interval
  let audioEnergy = 0;

  function acceleratorStep() {
    if (step >= maxSteps) return;

    const loops = theta / (2 * Math.PI);

    // Smooth ramp after 3 loops
    if (loops > 3) {
      const extra = loops - 3;
      acceleration = baseAcceleration + extra * 0.01;
    }

    // Update angular velocity with cap
    omega += acceleration;
    if (omega > maxOmega) omega = maxOmega;

    theta += omega;

    // Begin collapse near max speed
    if (omega >= maxOmega * 0.95) {
      shrinking = true;
    }

    if (shrinking) {
      radius *= 0.96;
      if (radius < 0.1) radius = 0;
    }

    const y = origin.y + step * 0.02;

    const x1 = origin.x + Math.cos(theta) * radius;
    const z1 = origin.z + Math.sin(theta) * radius;

    item1.teleport({ x: x1, y: y, z: z1 });
    player.spawnParticle("minecraft:endrod", { x: x1, y: y, z: z1 });

    if (item2) {
      const x2 = origin.x + Math.cos(theta + Math.PI) * radius;
      const z2 = origin.z + Math.sin(theta + Math.PI) * radius;

      item2.teleport({ x: x2, y: y, z: z2 });
      player.spawnParticle("minecraft:endrod", { x: x2, y: y, z: z2 });
    }

    // ---- Dynamic Sound System ----
    
    let rawRatio = (omega + 0.1) / maxOmega;
    if (rawRatio > 1) rawRatio = 1;

    // Audio smoothing (inertia)
    audioEnergy += (rawRatio - audioEnergy) * 0.05;

    // Now use smoothed value
    let eased = Math.pow(audioEnergy, 1.5); 
    // >1 exponent = slower early climb, smoother overall

    // Pitch 0.7 → 2.0
    let pitch = 0.7 + eased * 1.3;

    // Interval shrinks gradually
    let intervalFloat =
      maxInterval - eased * (maxInterval - minInterval);

    let interval = Math.max(minInterval, Math.floor(intervalFloat));

    soundTickCounter++;

    if (soundTickCounter >= interval) {
      soundTickCounter = 0;

      player.playSound("random.levelup", {
        location: origin,
        volume: 0.5,
        pitch: pitch
      });
    }

    step++;
    system.runTimeout(acceleratorStep, 1);
  }

  system.runTimeout(acceleratorStep, 20);

  system.runTimeout(() => player.playSound("beacon.power", { location: origin}), 20 + maxSteps)
  system.runTimeout(() => player.spawnParticle("minecraft:witchspell_emitter", {x: origin.x, y: origin.y + 5, z: origin.z}), 20 + maxSteps)
}

/**
 * Custom enchant shop UI.
 *
 * @param {Player} player
 */
export function enchantShopMenu (player) {
  // experimenting(player)

  const shopMenu = new ChestFormData('large')
    .title('§bSuper Enchants')
    .button(4, '§bEncants Menu', ['§7Buy and Use Enchanted Tomes'], 'textures/items/paper')
    .button(20, '§aBuy Tomes', ['§7Buy Enchanted Tomes'], 'textures/blocks/glass_green')
    .button(22, '§dView Enchants', ['§7View Enchanted Tomes'], 'textures/blocks/glass_orange')
    .button(24, '§bApply Tomes', ['§7Apply Enchanted Tomes'], 'textures/blocks/glass_blue')
    .button(45, '§aBack', [], 'textures/items/arrow')

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
        enchantBuyMenu(player)
        break
      case 45:
        MainMenuManager.init(player)
        break
    }
  })
}
