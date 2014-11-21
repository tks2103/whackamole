"use strict";

var canvas = document.getElementById("game"),
    r = new Renderer(canvas),
    em = new EntityManager(),
    input = new InputManager(canvas);

    em.generateHole({ x: 30, y: 30 });
    em.generateMole({ x: 30, y: 30 });
r.drawEntities(em.entityArray());
