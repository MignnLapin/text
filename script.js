const rCursor = document.getElementById('real-cursor');
const glow = document.getElementById('glow');
const dot = document.getElementById('dot');

// --- 1. 粒子爆炸逻辑 (点击/特定交互触发) ---
function explode(x, y) {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div'); 
        p.className = 'p';
        p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
        p.style.left = x + 'px'; 
        p.style.top = y + 'px';
        document.body.appendChild(p);
        
        const a = Math.random() * Math.PI * 2, v = Math.random() * 4 + 2;
        let vx = Math.cos(a) * v, vy = Math.sin(a) * v, o = 1;
        
        function moveParticle() {
            p.style.left = (parseFloat(p.style.left) + vx) + 'px';
            p.style.top = (parseFloat(p.style.top) + vy) + 'px';
            o -= 0.02; 
            p.style.opacity = o;
            if (o > 0) requestAnimationFrame(moveParticle); else p.remove();
        }
        moveParticle();
    }
}

// --- 2. 状态控制与鼠标移动监听 ---
let mIn = false, isIdle = true; 
let cX = window.innerWidth / 2, cY = window.innerHeight / 2; // 当前光标位置
let tX = cX, tY = cY; // 目标位置（真实鼠标位置）
let idleT, vx = 0, vy = 0;
const SPEED_MIN = 3, SPEED_MAX = 6;

function randomizeVelocity() {
    const angle = Math.random() * Math.PI * 2;
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
}

window.onmousemove = e => {
    mIn = true; 
    isIdle = false;
    tX = e.clientX; 
    tY = e.clientY;
    
    // 更新辅助真实光标
    rCursor.style.left = e.clientX + 'px';
    rCursor.style.top = e.clientY + 'px';
    rCursor.style.opacity = '1';
    
    // 停止移动2秒后进入闲置流浪模式
    clearTimeout(idleT);
    idleT = setTimeout(() => { 
        isIdle = true; 
        rCursor.style.opacity = '0'; 
        randomizeVelocity(); 
    }, 2000);
};

document.addEventListener('mouseleave', () => { 
    mIn = false; 
    isIdle = true; 
    rCursor.style.opacity = '0'; 
    randomizeVelocity(); 
});

// --- 3. 核心动画循环 (插值跟随 & 碰撞检测) ---
function anim() {
    if (!isIdle && mIn) {
        // 平滑跟随：当前位置向目标位置靠近 (插值系数 0.15)
        cX += (tX - cX) * 0.15;
        cY += (tY - cY) * 0.15;
    } else {
        // 流浪模式：按随机速度移动
        cX += vx; cY += vy;
        
        // 边界碰撞检测
        let hit = false; const r = 5;
        if (cX <= r || cX >= window.innerWidth - r) hit = true;
        if (cY <= r || cY >= window.innerHeight - r) hit = true;
        
        if (hit) {
            randomizeVelocity(); // 撞墙后随机反弹
            if (cX <= r && vx < 0) vx = Math.abs(vx);
            if (cX >= window.innerWidth - r && vx > 0) vx = -Math.abs(vx);
            if (cY <= r && vy < 0) vy = Math.abs(vy);
            if (cY >= window.innerHeight - r && vy > 0) vy = -Math.abs(vy);
        }
    }
    
    // 应用坐标到 DOM
    glow.style.left = dot.style.left = cX + 'px';
    glow.style.top = dot.style.top = cY + 'px';
    requestAnimationFrame(anim);
}

// 启动动画
randomizeVelocity();
anim();