import { world } from "@minecraft/server";

export const AfterEventManager = {
    // contains function for each event
    handlers: {
        entityhitentity: [],
        entityhurt: []
    },

    // sets up the events
    init() {
        // template
        // world.afterEvents.tick.subscribe(ev => {
        //     for (const fn of this.handlers.tick) fn(ev);
        // });
        // Entity Hit Entity
        world.afterEvents.entityHitEntity.subscribe((event) => {
            for (const func of this.handlers.entityhitentity) func(event);
        })
        // Entity Hurt
        world.afterEvents.entityHurt.subscribe((event) => {
            for (const func of this.handlers.entityhurt) func(event);
        })
    },

    // adds functions to be called when events triggers
    register(eventType, func) {
        this.handlers[eventType]?.push(func);
    }
};