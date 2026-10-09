// Illustrative price simulation. No market data or network requests are used.
window.createTradingChart = function (host) {
  const element = (tag, className, value = "") => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = value;
    return node;
  };
  const chart = element("div", "market-simulation");
  const heading = element("div", "market-heading");
  const quote = element("div", "market-quote");
  const price = element("span", "market-price");
  const change = element("span", "market-change");
  quote.append(price, change);
  heading.append(element("span", "market-label", "Simulated Market"), quote);
  const canvas = element("canvas", "market-canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Simulated candlestick prices: green candles indicate gains and red candles indicate losses. Values are fictional.");
  const symbols = element("div", "crypto-symbols");
  const bitcoin = element("span", "crypto-symbol");
  const bitcoinMark = element("span", "bitcoin-mark", "₿");
  bitcoinMark.setAttribute("aria-hidden", "true");
  bitcoin.append(bitcoinMark, element("span", "", "Bitcoin"));
  const ethereum = element("span", "crypto-symbol");
  const ethImage = element("img", "ethereum-mark");
  ethImage.src = "./assets/ethereum.svg";
  ethImage.alt = "";
  ethereum.append(ethImage, element("span", "", "Ethereum"));
  symbols.append(bitcoin, ethereum);
  chart.append(heading, canvas, symbols);
  host.append(chart);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const gain = "#8bd9ac", loss = "#ed949e";
  const capacity = 19, duration = 2.4;
  let seed = 67, step = 0, elapsed = 0, last = 0, visible = true;
  let width = 480, height = 240;
  const candles = [];
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  function next(open) {
    step++;
    // Alternating runs, dips, and larger spikes keep the fictional market varied.
    const movement = Math.sin(step * 1.47) * 4 + (random() - .5) * 5 + (step % 7 === 0 ? (step % 14 === 0 ? -9 : 9) : 0);
    const close = Math.max(30, Math.min(180, open + movement));
    return {open, close, high: Math.max(open,close) + 1 + random()*2.5, low: Math.min(open,close) - 1 - random()*2.5};
  }
  let value = 100;
  for (let i=0;i<12;i++) { const candle=next(value); candles.push(candle); value=candle.close; }
  let current = next(value);
  function render() {
    const progress = preference.matches ? .7 : Math.min(elapsed / duration, 1);
    const close = current.open + (current.close-current.open)*progress + (preference.matches ? 0 : Math.sin(progress*Math.PI*4)*Math.sin(progress*Math.PI)*1.1);
    const live = {open:current.open,close,high:Math.max(current.open,close)+(current.high-Math.max(current.open,current.close))*progress,low:Math.min(current.open,close)-(Math.min(current.open,current.close)-current.low)*progress};
    const all = [...candles, live];
    const low = Math.min(...all.map(c=>c.low))-4;
    const high = Math.max(...all.map(c=>c.high))+4;
    const top = 18, bottom = height-30, right = width-52;
    const y = number => top + (high-number)/(high-low)*(bottom-top);
    const spacing = (right-12)/capacity;
    const offset = candles.length >= capacity ? progress * spacing : 0;
    ctx.clearRect(0,0,width,height);
    ctx.font = "11px 'Instrument Sans', Arial, sans-serif";
    ctx.textBaseline = "middle";
    for (let i=0;i<4;i++) {
      const number = low+(high-low)*i/3;
      const yy = y(number);
      ctx.strokeStyle="#ffffff0d";ctx.lineWidth=1;ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(8,yy);ctx.lineTo(right,yy);ctx.stroke();
      ctx.fillStyle="#858c98";ctx.textAlign="right";ctx.fillText(number.toFixed(0),width-2,yy);
    }
    all.forEach((candle,index) => {
      const x = 12 + index*spacing - offset;
      if(x<0) return;
      const color = candle.close>=candle.open?gain:loss;
      ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.3;
      ctx.beginPath();ctx.moveTo(x,y(candle.high));ctx.lineTo(x,y(candle.low));ctx.stroke();
      const bodyTop=Math.min(y(candle.open),y(candle.close));
      ctx.fillRect(x-spacing*.24,bodyTop,spacing*.48,Math.max(2,Math.abs(y(candle.open)-y(candle.close))));
      // Sparse annotations keep theoretical gains and losses legible on mobile.
      if(index % 5 === 2 && index<all.length-1) {
        const delta=candle.close-candle.open;
        ctx.textAlign="center";ctx.font="10px 'Instrument Sans', Arial, sans-serif";
        ctx.fillText(`${delta>=0?'+':'−'}${Math.abs(delta).toFixed(1)}`,x,delta>=0?y(candle.high)-9:y(candle.low)+10);
      }
    });
    const color=close>=current.open?gain:loss;
    ctx.setLineDash([3,5]);ctx.strokeStyle=color+'66';
    ctx.beginPath();ctx.moveTo(8,y(close));ctx.lineTo(right,y(close));ctx.stroke();ctx.setLineDash([]);
    price.textContent=`$${close.toFixed(2)}`;
    const delta=close-current.open;
    change.textContent=`${delta>=0?'+':'−'}$${Math.abs(delta).toFixed(2)} (${delta>=0?'+':'−'}${Math.abs(delta/current.open*100).toFixed(2)}%)`;
    quote.style.color=color;
  }
  new ResizeObserver(() => {
    width=canvas.getBoundingClientRect().width;
    height=canvas.getBoundingClientRect().height;
    const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=width*ratio;canvas.height=height*ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    render();
  }).observe(canvas);
  if('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(host);
  preference.addEventListener('change',render);
  function frame(now) {
    const dt=last?Math.min((now-last)/1000,.1):0;last=now;
    if(visible && !document.hidden && !preference.matches) {
      elapsed+=dt;
      if(elapsed>=duration) {
        candles.push(current);
        if(candles.length>capacity) candles.shift();
        current=next(current.close);
        elapsed-=duration;
      }
      render();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
