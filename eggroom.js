var did_talk = 0;

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

async function dialogue1(){  
    if(did_talk == 0){
        await window.alert("(Well, there is a man here.)");
        await window.alert("(He offered you something.)");
        await window.alert("(You received an Egg.)");
        downloadPNG("egg.png");
        did_talk = 1;
    } else {
        window.alert("(Well, there is not a man here.)");
    }
}

async function dialogue2(){  
    await window.alert("(He is behind the tree.)");
}

async function downloadPNG(fileName = "egg.png") {
    const response = await fetch("images/egg.png");
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}

document.getElementById("button1").addEventListener("click", dialogue1);
document.getElementById("button2").addEventListener("click", dialogue2);

//tree based on the in game rendering of the tree
const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');
const layer3 = document.getElementById('layer3');
const blockEl = document.getElementById('block');

let siner = Math.random() * 600;
let blocktimer = 0;
let block = null;

function spawnBlock() {
    const xv = (layer1.getBoundingClientRect().width / 4) + Math.random() * (layer1.getBoundingClientRect().width / 2);
    const yv = (layer1.getBoundingClientRect().height / 4) + Math.random() * (layer1.getBoundingClientRect().height / 4);
    return {
        x: xv,
        y: yv,
        hspeed: 0.4 + Math.random(),
        vspeed: 0.7 + Math.random() * 1.5,
        alpha: 0,
        alive: true
    };
}

function step() {
    siner += 1;
    blocktimer += 1;
    
    layer2.style.translate = `${Math.sin(siner / 12) * 0.6250}vh ${Math.cos(siner / 20) * 0.6250}vh`;
    layer3.style.translate = `${Math.sin(siner / 14) * 0.3125}vh ${Math.cos(siner / 24) * 0.3125}vh`;

    if (blocktimer === 20) {
        block = spawnBlock();
        blockEl.style.display = 'block';
    }

    if (blocktimer >= 20 && blocktimer <= 30 && block) {
        block.alpha = Math.min(1, block.alpha + 0.2);
    }
    if (blocktimer >= 38 && block) {
        block.alpha = Math.max(0, block.alpha - 0.1);
    }
    if (blocktimer >= 48) {
        blocktimer = 0;
        block = null;
        blockEl.style.display = 'none';
    }

    if (block && block.alive) {
        block.hspeed += 0.1;
        const spd = Math.hypot(block.hspeed, block.vspeed);
        if (spd > 0) {
            const f = (spd + 0.1) / spd;
            block.hspeed *= f;
            block.vspeed *= f;
        }
        block.x += block.hspeed;
        block.y += block.vspeed;
        blockEl.style.left = block.x + 'px';
        blockEl.style.top = block.y + 'px';
        blockEl.style.opacity = block.alpha;
    }
}

const target_fps = 30;
const target_ms = 1000/target_fps
let last = 0, accum = 0;

function loop(ts) {
    accum += ts - last;
    last = ts;
    while (accum >= target_ms) {
        step();
        accum -= target_ms;
    }
    requestAnimationFrame(loop);
}

requestAnimationFrame(ts => { last = ts; requestAnimationFrame(loop); });

