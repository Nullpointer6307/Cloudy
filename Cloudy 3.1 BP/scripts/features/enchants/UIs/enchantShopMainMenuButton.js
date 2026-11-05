import { MainMenuManager } from '../../../core/coreFeatures/mainMenu/menuManager.js'
import { enchantShopMenu } from './enchantShopMenu.js'

MainMenuManager.addOption(
  'enchants',
  [25, '§bEnchants', ['§7Buy custom enchants'], 'textures/items/book_enchanted'],
  enchantShopMenu
)
