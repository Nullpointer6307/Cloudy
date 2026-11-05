import { MainMenuManager } from '../../../mainMenu/menuManager.js'
import { sellMenu } from './sellMenu.js'

MainMenuManager.addOption('sell', [22, '§aSell', ['§7Sell your items'], 'textures/blocks/wool_colored_lime'], sellMenu)
