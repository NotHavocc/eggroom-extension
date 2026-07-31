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

//tree based on the render script
const layer2 = document.getElementById('layer2');
const layer3 = document.getElementById('layer3');

let siner = Math.random() * 600;

function step() {
    siner += 1;
    layer2.style.translate = `${Math.sin(siner / 12) * 0.6250}vh ${Math.cos(siner / 20) * 0.6250}vh`;
    layer3.style.translate = `${Math.sin(siner / 14) * 0.3125}vh ${Math.cos(siner / 24) * 0.3125}vh`;
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

