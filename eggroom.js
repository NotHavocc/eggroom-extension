document.getElementById("button1").addEventListener("click", dialogue1);
document.getElementById("button2").addEventListener("click", dialogue2);

var did_talk = 0;

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

const img = document.getElementById("bg");
const stage = document.getElementById("stage");

const hotspots = {
  button1: { u: 0.478, v: 0.417, wFrac: 0.062, hFrac: 0.109 },
  button2: { u: 0.497, v: 0.738, wFrac: 0.075, hFrac: 0.121 }, 
};

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

function layout() {
  const cw = stage.clientWidth;
  const ch = stage.clientHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const scale = Math.max(cw / iw, ch / ih);
  const renderW = iw * scale;
  const renderH = ih * scale;
  const offsetX = (cw - renderW) / 2;
  const offsetY = (ch - renderH) / 2;

  for (const [id, h] of Object.entries(hotspots)) {
    const el = document.getElementById(id);
    const w = h.wFrac * renderW;
    const ht = h.hFrac * renderH;
    const cx = offsetX + h.u * renderW;
    const cy = offsetY + h.v * renderH;

    el.style.width = `${w}px`;
    el.style.height = `${ht}px`;
    el.style.left = `${cx - w / 2}px`;
    el.style.top = `${cy - ht / 2}px`;
  }
}

img.addEventListener("load", layout);
window.addEventListener("resize", layout);
if (img.complete) layout();