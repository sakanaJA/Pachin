const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Events } = Matter;



const engine = Engine.create();
const render = Render.create({
    element: document.body,
    canvas: document.getElementById('gameCanvas'),
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
    }
});


const bonusItem = Bodies.circle(250, 250, 15, { isStatic: true, label: 'bonusItem' });
World.add(engine.world, [bonusItem]);

Matter.Events.on(engine, 'collisionStart', event => {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (pair.bodyA.label === 'ball' && pair.bodyB.label === 'bonusItem' || pair.bodyB.label === 'ball' && pair.bodyA.label === 'bonusItem') {
            updateScore(50);  // ボーナススコアを追加
        }
    }
});
const movingObstacle = Bodies.rectangle(300, 200, 60, 10, { isStatic: false, label: 'movingObstacle' });
World.add(engine.world, [movingObstacle]);

setInterval(() => {
    Body.setVelocity(movingObstacle, {x: 5, y: 0}); // 横に動く
}, 2000);


Matter.Events.on(engine, 'collisionStart', event => {
    const pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (pair.bodyA.label === 'ball' && pair.bodyB.label === 'powerUp') {
            // 効果の適用
            // 例: ボールのサイズ変更: Body.scale(pair.bodyA, 2, 2);
            // 効果の持続時間や終了後の挙動などもここで定義する
        }
    }
});


const balls = [];
for (let i = 0; i < 5; i++) {
    balls.push(Bodies.circle(400 + i * 50, 100, 20, { restitution: 0.9, label: 'ball' }));
}
World.add(engine.world, balls);


let currentLevel = 1;
function loadLevel(level) {
    // 既存の物体をすべて削除するロジック（例：World.clear(engine.world, false)）

    if (level === 1) {
        // level 1 の配置
    } else if (level === 2) {
        // level 2 の配置
    }
    // ... 他のレベルも同様に
}



const ball = Bodies.circle(400, 100, 20, { restitution: 0.9, label: 'ball' });
const ground = Bodies.rectangle(400, 590, 810, 20, { isStatic: true });
const wallLeft = Bodies.rectangle(5, 300, 10, 600, { isStatic: true });
const wallRight = Bodies.rectangle(795, 300, 10, 600, { isStatic: true });
const pin1 = Bodies.circle(200, 300, 10, { isStatic: true });
const pin2 = Bodies.circle(600, 300, 10, { isStatic: true });

const slotZone = Bodies.rectangle(400, 550, 200, 10, { isStatic: true, label: 'slotZone' });

World.add(engine.world, [ball, ground, wallLeft, wallRight, pin1, pin2, slotZone]);

// Mouse drag constraints
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(engine.world, mouseConstraint);
render.mouse = mouse;

Events.on(mouseConstraint, 'enddrag', (event) => {
    if (event.body === ball) {
        Matter.Body.setVelocity(ball, { x: (ball.position.x - event.mouse.position.x) * -0.5, y: (ball.position.y - event.mouse.position.y) * -0.5 });
    }
});

Events.on(engine, 'collisionStart', event => {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        if ((pair.bodyA.label === 'ball' && pair.bodyB.label === 'slotZone') || (pair.bodyB.label === 'ball' && pair.bodyA.label === 'slotZone')) {
            triggerSlotFunction();
        }
    }
});

let currentScore = 0;

function triggerSlotFunction() {
    const result = Math.floor(Math.random() * 3) + 1;
    const points = result * 10;
    updateScore(points);
    document.getElementById('slotSound').play();
}

function updateScore(points) {
    currentScore += points;
    displayScore();
}

function displayScore() {
    document.getElementById('score').innerText = "現在のスコア: " + currentScore;
}

function saveScore() {
    localStorage.setItem('pachinkoScore', currentScore);
}

function loadScore() {
    const savedScore = localStorage.getItem('pachinkoScore');
    if (savedScore) {
        currentScore = parseInt(savedScore);
        displayScore();
    }
}

loadScore();

const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.2;
bgMusic.play();

Engine.run(engine);
Render.run(render);


// スロットの音の音量を50%に設定
const slotSound = document.getElementById('slotSound');
slotSound.volume = 0.2;
