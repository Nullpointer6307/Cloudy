import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe((data) => {
    const sender = data.sender
    const name = sender.name
    const message = data.message

    let chatRank = sender.getTags().filter(t => t.startsWith("rank:")).map(e => e.slice(5))

    world.sendMessage(`§8[§r${chatRank}§8] §7${name} §8> §r${message}`)

    data.cancel = true
});
