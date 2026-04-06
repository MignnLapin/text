const rCursor = document.getElementById('real-cursor');
const glow = document.getElementById('glow');
const dot = document.getElementById('dot');

// 状态变量
let mIn = false, isIdle = true; 
let cX = window.innerWidth / 2, cY = window.innerHeight / 2;
let tX = cX, tY = cY, idleT, vx = 0, vy = 0;
const SPEED_MIN = 3, SPEED_MAX = 6;

// 1. 随机化移动速度（用于流浪模式）
function randomizeVelocity() {
    const angle = Math.random() * Math.PI * 2;
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;
}

// 2. 粒子爆炸效果
function explode(x, y) {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'p';
        p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        document.body.appendChild(p);

        const a = Math.random() * Math.PI * 2, v = Math.random() * 4 + 2;
        let pvx = Math.cos(a) * v, pvy = Math.sin(a) * v, o = 1;

        function move() {
            p.style.left = (parseFloat(p.style.left) + pvx) + 'px';
            p.style.top = (parseFloat(p.style.top) + pvy) + 'px';
            o -= 0.02; p.style.opacity = o;
            if (o > 0) requestAnimationFrame(move); else p.remove();
        }
        move();
    }
}

// 3. 鼠标移动监听
window.onmousemove = e => {
    mIn = true; isIdle = false;
    tX = e.clientX; tY = e.clientY;
    rCursor.style.left = e.clientX + 'px';
    rCursor.style.top = e.clientY + 'px';
    rCursor.style.opacity = '1';

    clearTimeout(idleT);
    idleT = setTimeout(() => { 
        isIdle = true; 
        rCursor.style.opacity = '0'; 
        randomizeVelocity(); 
    }, 2000);
};

// 4. 全局点击爆炸
window.onclick = e => explode(e.clientX, e.clientY);

// 5. 动画循环
function anim() {
    if (!isIdle && mIn) {
        // 平滑跟随
        cX += (tX - cX) * 0.15;
        cY += (tY - cY) * 0.15;
    } else {
        // 自动流浪
        cX += vx; cY += vy;
        let hit = false; const r = 5;
        if (cX <= r || cX >= window.innerWidth - r) hit = true;
        if (cY <= r || cY >= window.innerHeight - r) hit = true;
        if (hit) {
            randomizeVelocity();
            if (cX <= r && vx < 0) vx = Math.abs(vx);
            if (cX >= window.innerWidth - r && vx > 0) vx = -Math.abs(vx);
            if (cY <= r && vy < 0) vy = Math.abs(vy);
            if (cY >= window.innerHeight - r && vy > 0) vy = -Math.abs(vy);
        }
    }
    glow.style.left = dot.style.left = cX + 'px';
    glow.style.top = dot.style.top = cY + 'px';
    requestAnimationFrame(anim);
}

// 初始化启动
window.onload = () => {
    randomizeVelocity();
    anim();
};