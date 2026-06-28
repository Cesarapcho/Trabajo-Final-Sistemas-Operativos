/* ── Navigation ── */
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  let cur = 0;

  function go(dir) {
    const next = Math.max(0, Math.min(total - 1, cur + dir));
    if (next === cur) return;
    const prev = cur;
    slides[prev].classList.remove('active');
    slides[prev].classList.add('prev');
    setTimeout(() => slides[prev].classList.remove('prev'), 400);
    cur = next;
    slides[cur].classList.add('active');
    document.getElementById('counter').textContent = (cur + 1) + ' / ' + total;
    document.getElementById('prev').disabled = cur === 0;
    document.getElementById('next').disabled = cur === total - 1;
    document.getElementById('progress').style.width = ((cur + 1) / total * 100) + '%';
    if (slides[cur].id === 's11') initCharts(true);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
  });
  document.getElementById('progress').style.width = (1 / total * 100) + '%';

  /* Chart.js: resultados animados */
  const resultData = {
    labels: ['FCFS', 'SJF', 'Round Robin', 'Prioridades'],
    wait: [12, 7, 10, 8],
    turnaround: [20, 15, 18, 16],
    cpu: [83, 91, 88, 90]
  };

  let mainChart = null;
  let donutChart = null;
  let chartMode = 'grouped';

  function chartOptions(titleText) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1300,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Space Grotesk' } }
        },
        title: {
          display: true,
          text: titleText,
          color: '#e2e8f0',
          font: { family: 'Space Grotesk', size: 14, weight: '600' }
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: '#1f2e4a',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8'
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148,163,184,.08)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148,163,184,.08)' }
        }
      }
    };
  }

  function initCharts(force = false) {
    if (!window.Chart) {
      const fallback = document.getElementById('mainChartFallback');
      if (fallback) fallback.style.display = 'block';
      return;
    }
    if (mainChart && donutChart && !force) return;
    buildMainChart(chartMode);
    buildDonutChart();
  }

  function buildMainChart(mode) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    if (mainChart) mainChart.destroy();

    if (mode === 'radar') {
      mainChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: resultData.labels,
          datasets: [
            {
              label: 'Tiempo de espera',
              data: resultData.wait,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,.16)',
              pointBackgroundColor: '#60a5fa'
            },
            {
              label: 'Tiempo de retorno',
              data: resultData.turnaround,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,.14)',
              pointBackgroundColor: '#34d399'
            }
          ]
        },
        options: {
          ...chartOptions('Comparación radial de tiempos'),
          scales: {
            r: {
              beginAtZero: true,
              ticks: { color: '#64748b', backdropColor: 'transparent' },
              grid: { color: 'rgba(148,163,184,.16)' },
              angleLines: { color: 'rgba(148,163,184,.12)' },
              pointLabels: { color: '#e2e8f0', font: { family: 'Space Grotesk' } }
            }
          }
        }
      });
      return;
    }

    mainChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: resultData.labels,
        datasets: [
          {
            label: 'Tiempo de espera',
            data: resultData.wait,
            backgroundColor: 'rgba(59,130,246,.78)',
            borderColor: '#60a5fa',
            borderWidth: 1,
            borderRadius: 8
          },
          {
            label: 'Tiempo de retorno',
            data: resultData.turnaround,
            backgroundColor: 'rgba(16,185,129,.72)',
            borderColor: '#34d399',
            borderWidth: 1,
            borderRadius: 8
          }
        ]
      },
      options: chartOptions('Gráficas de barras animadas')
    });
  }

  function buildDonutChart() {
    const ctx = document.getElementById('donutChart');
    if (!ctx) return;
    if (donutChart) donutChart.destroy();
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: resultData.labels,
        datasets: [{
          data: resultData.cpu,
          backgroundColor: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'],
          borderColor: '#111827',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', boxWidth: 10, font: { family: 'Space Grotesk', size: 10 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

  function setChartMode(mode) {
    chartMode = mode;
    const grouped = document.getElementById('chart-toggle-grouped');
    const radar = document.getElementById('chart-toggle-radar');
    if (grouped && radar) {
      grouped.style.background = mode === 'grouped' ? 'var(--accent)' : 'var(--surface2)';
      grouped.style.color = mode === 'grouped' ? '#fff' : 'var(--text-muted)';
      grouped.style.border = mode === 'grouped' ? 'none' : '1px solid var(--border)';
      radar.style.background = mode === 'radar' ? 'var(--accent)' : 'var(--surface2)';
      radar.style.color = mode === 'radar' ? '#fff' : 'var(--text-muted)';
      radar.style.border = mode === 'radar' ? 'none' : '1px solid var(--border)';
    }
    buildMainChart(mode);
  }

  /* ── Simulator ── */
  const COLORS = ['#3b82f6','#6366f1','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#8b5cf6'];

  let processes = [
    {id:'P1', llegada:0, rafaga:5, prioridad:2},
    {id:'P2', llegada:1, rafaga:3, prioridad:1},
    {id:'P3', llegada:2, rafaga:8, prioridad:4},
    {id:'P4', llegada:3, rafaga:2, prioridad:3},
  ];

  let currentAlgo = 'FCFS';
  let simTimeline = [];   // [{pid, start, end}]
  let animIdx = 0;
  let animTimer = null;
  let totalTime = 0;

  /* ── Simulator helpers ── */
  function normalizeNumber(value, fallback, min) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.floor(parsed));
  }

  function normalizeProcesses(source = processes) {
    return source.map((p, index) => ({
      ...p,
      procIndex: index,
      id: String(p.id || `P${index + 1}`).trim() || `P${index + 1}`,
      llegada: normalizeNumber(p.llegada, 0, 0),
      rafaga: normalizeNumber(p.rafaga, 1, 1),
      prioridad: normalizeNumber(p.prioridad, 1, 1)
    }));
  }

  function byArrival(a, b) {
    return a.llegada - b.llegada || a.procIndex - b.procIndex;
  }

  function addIdle(tl, start, end) {
    if (end > start) {
      tl.push({ pid: 'CPU libre', procIndex: null, start, end, idle: true });
    }
  }

  function addRun(tl, p, start, duration) {
    if (duration > 0) {
      tl.push({ pid: p.id, procIndex: p.procIndex, start, end: start + duration });
    }
  }

  function executionSegments(tl) {
    return tl.filter(seg => !seg.idle);
  }

  /* ── Build proc table ── */
  function renderProcTable() {
    const tbody = document.getElementById('proc-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    processes.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input class="proc-input" value="${escapeHtml(p.id)}" oninput="processes[${i}].id=this.value; handleProcessChange()"></td>
        <td><input class="proc-input" type="number" min="0" value="${p.llegada}" oninput="processes[${i}].llegada=this.value; handleProcessChange()"></td>
        <td><input class="proc-input" type="number" min="1" value="${p.rafaga}" oninput="processes[${i}].rafaga=this.value; handleProcessChange()"></td>
        <td><input class="proc-input" type="number" min="1" value="${p.prioridad}" oninput="processes[${i}].prioridad=this.value; handleProcessChange()"></td>
        <td>${processes.length > 1 ? `<button class="remove-process-btn" onclick="removeProcess(${i})" aria-label="Eliminar proceso ${escapeHtml(p.id)}">×</button>` : ''}</td>`;
      tbody.appendChild(tr);
    });
  }

  function addProcess() {
    const n = processes.length + 1;
    processes.push({ id: 'P' + n, llegada: n - 1, rafaga: Math.ceil(Math.random() * 6) + 1, prioridad: n });
    renderProcTable();
    renderLiveSimulation();
  }

  function removeProcess(i) {
    processes.splice(i, 1);
    renderProcTable();
    renderLiveSimulation();
  }

  /* ── Algo selector ── */
  function updateAlgoUI() {
    document.querySelectorAll('.algo-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.algo === currentAlgo);
    });
    const quantumWrap = document.getElementById('quantum-wrap');
    if (quantumWrap) quantumWrap.classList.toggle('is-muted', currentAlgo !== 'RR');
  }

  document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAlgo = btn.dataset.algo;
      updateAlgoUI();
      renderLiveSimulation();
    });
  });

  /* ── Scheduling algorithms ── */
  function runFCFS(procs) {
    const sorted = normalizeProcesses(procs).sort(byArrival);
    let t = 0;
    const tl = [];
    sorted.forEach(p => {
      addIdle(tl, t, p.llegada);
      t = Math.max(t, p.llegada);
      addRun(tl, p, t, p.rafaga);
      t += p.rafaga;
    });
    return tl;
  }

  function runSJF(procs) {
    const ps = normalizeProcesses(procs);
    const done = new Set();
    const tl = [];
    let t = 0;

    while (done.size < ps.length) {
      const avail = ps
        .filter(p => p.llegada <= t && !done.has(p.procIndex))
        .sort((a, b) => a.rafaga - b.rafaga || byArrival(a, b));

      if (!avail.length) {
        const nextArrival = Math.min(...ps.filter(p => !done.has(p.procIndex)).map(p => p.llegada));
        addIdle(tl, t, nextArrival);
        t = nextArrival;
        continue;
      }

      const p = avail[0];
      addRun(tl, p, t, p.rafaga);
      t += p.rafaga;
      done.add(p.procIndex);
    }
    return tl;
  }

  function runRR(procs, q) {
    const quantum = normalizeNumber(q, 2, 1);
    const ps = normalizeProcesses(procs)
      .map(p => ({ ...p, rem: p.rafaga }))
      .sort(byArrival);
    const queue = [];
    const tl = [];
    let t = 0;
    let i = 0;
    let completed = 0;

    const enqueueArrivals = () => {
      while (i < ps.length && ps[i].llegada <= t) {
        queue.push(ps[i]);
        i++;
      }
    };

    while (completed < ps.length) {
      enqueueArrivals();

      if (!queue.length) {
        const nextArrival = ps[i]?.llegada;
        if (nextArrival === undefined) break;
        addIdle(tl, t, nextArrival);
        t = nextArrival;
        enqueueArrivals();
      }

      const p = queue.shift();
      const run = Math.min(quantum, p.rem);
      addRun(tl, p, t, run);
      t += run;
      p.rem -= run;

      enqueueArrivals();
      if (p.rem > 0) {
        queue.push(p);
      } else {
        completed++;
      }
    }
    return tl;
  }

  function runPRI(procs) {
    const ps = normalizeProcesses(procs);
    const done = new Set();
    const tl = [];
    let t = 0;

    while (done.size < ps.length) {
      const avail = ps
        .filter(p => p.llegada <= t && !done.has(p.procIndex))
        .sort((a, b) => a.prioridad - b.prioridad || byArrival(a, b));

      if (!avail.length) {
        const nextArrival = Math.min(...ps.filter(p => !done.has(p.procIndex)).map(p => p.llegada));
        addIdle(tl, t, nextArrival);
        t = nextArrival;
        continue;
      }

      const p = avail[0];
      addRun(tl, p, t, p.rafaga);
      t += p.rafaga;
      done.add(p.procIndex);
    }
    return tl;
  }

  function quantumValue() {
    return normalizeNumber(document.getElementById('quantum-input')?.value, 2, 1);
  }

  function computeTimeline() {
    if (currentAlgo === 'FCFS') return runFCFS(processes);
    if (currentAlgo === 'SJF') return runSJF(processes);
    if (currentAlgo === 'RR') return runRR(processes, quantumValue());
    return runPRI(processes);
  }

  function getTimelineForAlgo(algo) {
    if (algo === 'FCFS') return runFCFS(processes);
    if (algo === 'SJF') return runSJF(processes);
    if (algo === 'RR') return runRR(processes, quantumValue());
    return runPRI(processes);
  }

  function handleQuantumChange() {
    renderLiveSimulation();
  }

  function handleProcessChange() {
    processes = normalizeProcesses().map(({ id, llegada, rafaga, prioridad }) => ({ id, llegada, rafaga, prioridad }));
    renderLiveSimulation();
  }

  /* ── Metrics ── */
  function computeMetricsForTimeline(tl) {
    const ps = normalizeProcesses();
    const finish = tl.reduce((mx, seg) => Math.max(mx, seg.end), 0);
    const busyTime = executionSegments(tl).reduce((sum, seg) => sum + (seg.end - seg.start), 0);
    const stats = {};
    ps.forEach(p => {
      stats[p.procIndex] = { llegada: p.llegada, rafaga: p.rafaga, fin: null };
    });
    tl.forEach(seg => {
      if (!seg.idle && stats[seg.procIndex]) {
        stats[seg.procIndex].fin = Math.max(stats[seg.procIndex].fin || 0, seg.end);
      }
    });

    let sumWT = 0;
    let sumTT = 0;
    let n = 0;
    Object.values(stats).forEach(s => {
      if (s.fin === null) return;
      const tt = s.fin - s.llegada;
      const wt = tt - s.rafaga;
      sumWT += wt;
      sumTT += tt;
      n++;
    });

    return {
      avgWT: n ? (sumWT / n).toFixed(2) : '-',
      avgTT: n ? (sumTT / n).toFixed(2) : '-',
      cpuUtil: finish > 0 ? (busyTime / finish * 100).toFixed(1) + '%' : '-',
      finish,
      segments: executionSegments(tl).length
    };
  }

  function renderMetrics(tl) {
    const m = computeMetricsForTimeline(tl);
    const algoColor = { FCFS: '#3b82f6', SJF: '#10b981', RR: '#6366f1', PRI: '#f59e0b' }[currentAlgo] || '#3b82f6';
    document.getElementById('metrics-box').innerHTML = `
      <div class="metric-row"><span class="lbl">Espera prom.</span><span class="val" style="color:${algoColor};">${m.avgWT} u.</span></div>
      <div class="metric-divider"></div>
      <div class="metric-row"><span class="lbl">Retorno prom.</span><span class="val" style="color:${algoColor};">${m.avgTT} u.</span></div>
      <div class="metric-divider"></div>
      <div class="metric-row"><span class="lbl">Utilización CPU</span><span class="val" style="color:var(--accent3);">${m.cpuUtil}</span></div>
      <div class="metric-divider"></div>
      <div class="metric-row"><span class="lbl">Finaliza en</span><span class="val">${m.finish} u.</span></div>
      <div class="metric-divider"></div>
      <div class="metric-row"><span class="lbl">Segmentos CPU</span><span class="val">${m.segments}</span></div>
    `;
  }

  /* ── Gantt render ── */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function miniGanttHTML(tl) {
    const maxEnd = Math.max(1, ...tl.map(seg => seg.end));
    return tl.map(seg => {
      const left = seg.start / maxEnd * 100;
      const width = (seg.end - seg.start) / maxEnd * 100;
      const color = seg.idle ? 'rgba(148,163,184,.28)' : COLORS[seg.procIndex % COLORS.length];
      const label = seg.idle ? 'Idle' : seg.pid;
      return `<span class="mini-seg ${seg.idle ? 'idle' : ''}" style="left:${left}%;width:${width}%;background:${color};">${escapeHtml(label)}</span>`;
    }).join('');
  }

  function renderComparison() {
    const grid = document.getElementById('comparison-grid');
    if (!grid) return;
    const algos = [
      { key: 'FCFS', label: 'FCFS', color: '#3b82f6' },
      { key: 'SJF', label: 'SJF', color: '#10b981' },
      { key: 'RR', label: 'Round Robin', color: '#6366f1' },
      { key: 'PRI', label: 'Prioridades', color: '#f59e0b' }
    ];

    grid.innerHTML = algos.map(algo => {
      const tl = getTimelineForAlgo(algo.key);
      const m = computeMetricsForTimeline(tl);
      return `
        <article class="comparison-card" style="border-left-color:${algo.color};">
          <div class="comparison-head">
            <span class="comparison-title">${algo.label}</span>
            <span class="comparison-badge" style="color:${algo.color};border-color:${algo.color};">${m.segments} segmentos</span>
          </div>
          <div class="comparison-metrics">
            <div class="comparison-metric"><strong>${m.avgWT}</strong><span>Espera</span></div>
            <div class="comparison-metric"><strong>${m.avgTT}</strong><span>Retorno</span></div>
            <div class="comparison-metric"><strong>${m.cpuUtil}</strong><span>CPU</span></div>
          </div>
          <div class="mini-gantt">${miniGanttHTML(tl)}</div>
        </article>
      `;
    }).join('');
  }

  function renderLiveSimulation() {
    clearInterval(animTimer);
    animTimer = null;
    animIdx = 0;
    simTimeline = computeTimeline();
    buildGanttDOM(simTimeline);
    renderMetrics(simTimeline);
    renderComparison();
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.textContent = '▶ Play';
  }

  function buildGanttDOM(tl, visibleCount) {
    const area = document.getElementById('gantt-inner');
    const ganttArea = document.getElementById('gantt-area');
    if (!area || !ganttArea) return;
    area.innerHTML = '';

    const ps = normalizeProcesses();
    const rowH = 40;
    const labelW = 58;
    const axisH = 24;
    const minPlotW = Math.max(620, tl.length * 42);

    totalTime = tl.reduce((mx, s) => Math.max(mx, s.end), 0);
    area.style.position = 'relative';
    area.style.minWidth = (labelW + minPlotW + 20) + 'px';
    area.style.height = (ps.length * rowH + axisH) + 'px';

    if (!totalTime || !ps.length) {
      area.innerHTML = '<div class="empty-state">Agrega procesos para iniciar la simulación.</div>';
      return;
    }

    const areaW = Math.max(minPlotW, ganttArea.clientWidth - labelW - 36);
    const scale = areaW / totalTime;

    const tickStep = Math.max(1, Math.ceil(totalTime / 10));
    for (let tick = 0; tick <= totalTime; tick += tickStep) {
      const x = labelW + tick * scale;
      const line = document.createElement('div');
      line.className = 'gantt-tick-line';
      line.style.left = x + 'px';
      area.appendChild(line);

      const lbl = document.createElement('div');
      lbl.className = 'gantt-tick-label';
      lbl.style.left = (x - 8) + 'px';
      lbl.textContent = tick;
      area.appendChild(lbl);
    }

    ps.forEach((p, ri) => {
      const y = ri * rowH;
      const lbl = document.createElement('div');
      lbl.className = 'gantt-row-label';
      lbl.style.top = y + 'px';
      lbl.style.width = labelW + 'px';
      lbl.textContent = p.id;
      area.appendChild(lbl);

      const track = document.createElement('div');
      track.className = 'gantt-track-bg';
      track.style.left = labelW + 'px';
      track.style.top = (y + 4) + 'px';
      track.style.width = areaW + 'px';
      area.appendChild(track);
    });

    const visible = tl.slice(0, visibleCount === undefined ? tl.length : visibleCount);
    visible.forEach(seg => {
      if (seg.idle) return;
      const ri = ps.findIndex(p => p.procIndex === seg.procIndex);
      if (ri < 0) return;
      const x = labelW + seg.start * scale;
      const w = Math.max((seg.end - seg.start) * scale - 2, 6);
      const y = ri * rowH + 4;

      const bar = document.createElement('div');
      bar.className = 'g-bar';
      bar.style.left = x + 'px';
      bar.style.top = y + 'px';
      bar.style.width = w + 'px';
      bar.style.background = COLORS[seg.procIndex % COLORS.length];
      bar.textContent = w > 64 ? `${seg.pid} · ${seg.start}→${seg.end}` : (w > 28 ? seg.pid : '');

      const tt = document.getElementById('tooltip');
      bar.addEventListener('mouseenter', () => {
        tt.style.display = 'block';
        tt.innerHTML = `<strong>${escapeHtml(seg.pid)}</strong><br>Inicio: ${seg.start} u.<br>Fin: ${seg.end} u.<br>Duración: ${seg.end - seg.start} u.`;
      });
      bar.addEventListener('mousemove', e => {
        tt.style.left = (e.clientX + 12) + 'px';
        tt.style.top = (e.clientY - 10) + 'px';
      });
      bar.addEventListener('mouseleave', () => { tt.style.display = 'none'; });

      area.appendChild(bar);
    });
  }

  /* ── Play / Step / Reset ── */
  function resetSim() {
    renderLiveSimulation();
  }

  function stepGantt() {
    clearInterval(animTimer);
    animTimer = null;
    document.getElementById('play-btn').textContent = '▶ Play';
    if (!simTimeline.length) simTimeline = computeTimeline();
    if (animIdx >= simTimeline.length) return;
    animIdx++;
    buildGanttDOM(simTimeline, animIdx);
    if (animIdx >= simTimeline.length) renderMetrics(simTimeline);
  }

  function playGantt() {
    if (animTimer) {
      clearInterval(animTimer);
      animTimer = null;
      document.getElementById('play-btn').textContent = '▶ Play';
      return;
    }
    simTimeline = computeTimeline();
    if (!simTimeline.length) return;
    animIdx = 0;
    document.getElementById('play-btn').textContent = '⏸ Pausa';
    const speed = parseInt(document.getElementById('speed-sel').value, 10) || 300;
    animTimer = setInterval(() => {
      animIdx++;
      buildGanttDOM(simTimeline, animIdx);
      if (animIdx >= simTimeline.length) {
        clearInterval(animTimer);
        animTimer = null;
        document.getElementById('play-btn').textContent = '▶ Play';
        renderMetrics(simTimeline);
      }
    }, speed);
  }

  window.addEventListener('resize', () => {
    if (simTimeline.length) buildGanttDOM(simTimeline, animIdx || undefined);
  });

  /* ── Init ── */
  renderProcTable();
  updateAlgoUI();
  renderLiveSimulation();
  initCharts();
