import { MainMenuManager } from '../../../mainMenu/menuManager.js'
import { buyMenu } from './buyMenu.js'

MainMenuManager.addOption('shop', [24, '§eShop', ['§7Buy Items From the Shop'], 'textures/blocks/wool_colored_yellow'], buyMenu)
