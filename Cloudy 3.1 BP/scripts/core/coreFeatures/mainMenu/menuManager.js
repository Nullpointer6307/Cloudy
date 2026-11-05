import { Player } from '@minecraft/server'
import { ChestFormData } from 'extensions/forms.js'

export const MainMenuManager = {
  // buttons to add to the menu
  options: {},

  /**
   * Initializes the main menu.
   *
   * @param {Player} player - The player to show the menu to.
   */
  init(player) {
    const menu = new ChestFormData('large')
      .title('§6Main Menu')
      .button(4, '§hWelcome to §l§bCloudy §cFactions', [], 'textures/items/paper')
      .pattern(
        [
          'xxxx_xxxx',
          'x_______x',
          'x_______x',
          'x_______x',
          'x_______x',
          'xxxxxxxxx'
        ],
        {
          x: {itemName: '', itemDesc: [''], enchanted: false, stackAmount: 1, texture: 'textures/blocks/glass_black'}
        }
    )

    for (const option in this.options) {
      const [slot, itemName, itemDesc, texture] = this.options[option][0]
      menu.button(slot, itemName, itemDesc, texture)
    }

    // Procedurally handle button functionality
    menu.show(player).then((response) => {
      if (response.canceled) return
      // Find the option whose slot matches the selected button
      for (const option in this.options) {
        const [buttonOptions, func] = this.options[option]
        const slot = buttonOptions[0]
        if (response.selection === slot && typeof func === 'function') {
          func(player)
          break
        }
      }
    })
  },

  /**
   * Adds an option to the menu.
   *
   * @param {string} name - The name of the option.
   * @param {[slot: number, itemName: string, itemDesc: string[], texture: string] => void} buttonOptions - The button callback function.
   * @param {Function} func - The function to call when the option is selected.
   */
  addOption(name, buttonOptions, func) {
    this.options[name] = [buttonOptions, func]
  }
}
