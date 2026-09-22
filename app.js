/* ==========================================================================
   AI-Based Automated Urban Parcel Mapping & Cadastral Feature Extraction
   Application Engine & GIS Layer Controller
   ========================================================================== */

const AppState = {
  activeScreen: 'dashboard',
  activeDatasetIndex: 0,
  isProcessing: false,
  processingProgress: 0,
  selectedParcelId: 'PAR-2024-0104',
  mapZoom: 1.0,
  mapPan: { x: 0, y: 0 },
  isDraggingMap: false,
  dragStart: { x: 0, y: 0 },
  splitRatio: 0.5,
  isDraggingSlider: false,
  activeTool: 'select',
  measurePoints: [],
  layers: {
    ortho: true,
    parcels: true,
    buildings: true,
    roads: true,
    dimensions: true,
    vertices: false
  }
};

const DATASETS = [
  {
    id: 'survey-sec4',
    name: 'Sector 4 Urban Residential Cadastre',
    location: 'Sector 4, New Capital Zone',
    crs: 'EPSG:32643 (UTM Zone 43N)',
    datum: 'WGS 84 / UTM 43N',
    centerLat: 28.6139,
    centerLon: 77.2090,
    flightAltitude: '120 m AGL',
    gsd: '2.8 cm/px',
    camera: 'DJI Zenmuse P1 (45 MP)',
    overlap: '80% Forward / 70% Side',
    captureDate: '2026-08-14 09:30 UTC',
    totalAreaHa: 4.82,
    parcelsCount: 15,
    buildingsCount: 22,
    meanConfidence: 96.8,
    boundaryRmse: '0.082 m',
    parcels: [
      {
        id: 'PAR-2024-0101',
        owner: 'DLF Residential Trust',
        landUse: 'Residential (Low-Rise)',
        areaM2: 540.2,
        areaSqFt: 5814.7,
        perimeterM: 94.6,
        buildingCount: 1,
        bldgAreaM2: 210.5,
        bcr: 38.9,
        status: 'Verified',
        confidence: 97.4,
        pts: [[120, 100], [320, 100], [320, 240], [120, 240]],
        buildings: [
          { pts: [[150, 120], [280, 120], [280, 210], [150, 210]], color: '#fb923c', height: '8.4m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0102',
        owner: 'Sharma Estate Holdings',
        landUse: 'Residential (Low-Rise)',
        areaM2: 520.0,
        areaSqFt: 5597.2,
        perimeterM: 92.8,
        buildingCount: 1,
        bldgAreaM2: 195.0,
        bcr: 37.5,
        status: 'Verified',
        confidence: 98.1,
        pts: [[330, 100], [530, 100], [530, 240], [330, 240]],
        buildings: [
          { pts: [[360, 120], [490, 120], [490, 210], [360, 210]], color: '#fb923c', height: '7.8m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0103',
        owner: 'Greenfield Realty Ltd',
        landUse: 'Residential (Duplex)',
        areaM2: 560.8,
        areaSqFt: 6036.4,
        perimeterM: 96.2,
        buildingCount: 2,
        bldgAreaM2: 240.0,
        bcr: 42.8,
        status: 'Verified',
        confidence: 96.5,
        pts: [[540, 100], [750, 100], [750, 240], [540, 240]],
        buildings: [
          { pts: [[565, 125], [640, 125], [640, 210], [565, 210]], color: '#fb923c', height: '6.5m (G+1)' },
          { pts: [[655, 125], [725, 125], [725, 210], [655, 210]], color: '#f97316', height: '6.5m (G+1)' }
        ]
      },
      {
        id: 'PAR-2024-0104',
        owner: 'Metropolitan Housing Board',
        landUse: 'Residential (Villa)',
        areaM2: 610.4,
        areaSqFt: 6570.3,
        perimeterM: 101.4,
        buildingCount: 1,
        bldgAreaM2: 260.0,
        bcr: 42.6,
        status: 'Verified',
        confidence: 99.2,
        pts: [[760, 100], [980, 100], [980, 240], [760, 240]],
        buildings: [
          { pts: [[790, 120], [940, 120], [940, 215], [790, 215]], color: '#fb923c', height: '9.2m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0105',
        owner: 'Apex Commercial Plaza',
        landUse: 'Commercial / Retail',
        areaM2: 890.0,
        areaSqFt: 9580.0,
        perimeterM: 122.0,
        buildingCount: 1,
        bldgAreaM2: 520.0,
        bcr: 58.4,
        status: 'Verified',
        confidence: 95.8,
        pts: [[120, 290], [350, 290], [350, 470], [120, 470]],
        buildings: [
          { pts: [[140, 310], [330, 310], [330, 445], [140, 445]], color: '#ea580c', height: '14.0m (G+4)' }
        ]
      },
      {
        id: 'PAR-2024-0106',
        owner: 'Civic Health Center',
        landUse: 'Public Infrastructure',
        areaM2: 780.5,
        areaSqFt: 8401.2,
        perimeterM: 114.0,
        buildingCount: 1,
        bldgAreaM2: 380.0,
        bcr: 48.7,
        status: 'Verified',
        confidence: 97.9,
        pts: [[365, 290], [580, 290], [580, 470], [365, 470]],
        buildings: [
          { pts: [[390, 310], [555, 310], [555, 435], [390, 435]], color: '#f59e0b', height: '11.5m (G+3)' }
        ]
      },
      {
        id: 'PAR-2024-0107',
        owner: 'Urban Education Trust',
        landUse: 'Institutional / School',
        areaM2: 1250.0,
        areaSqFt: 13454.9,
        perimeterM: 148.0,
        buildingCount: 2,
        bldgAreaM2: 610.0,
        bcr: 48.8,
        status: 'Verified',
        confidence: 98.4,
        pts: [[595, 290], [980, 290], [980, 470], [595, 470]],
        buildings: [
          { pts: [[620, 315], [780, 315], [780, 440], [620, 440]], color: '#d97706', height: '12.0m (G+3)' },
          { pts: [[810, 315], [950, 315], [950, 440], [810, 440]], color: '#d97706', height: '12.0m (G+3)' }
        ]
      },
      {
        id: 'PAR-2024-0108',
        owner: 'Sovereign Residences Block A',
        landUse: 'Residential (Townhouse)',
        areaM2: 480.0,
        areaSqFt: 5166.7,
        perimeterM: 88.0,
        buildingCount: 1,
        bldgAreaM2: 220.0,
        bcr: 45.8,
        status: 'Verified',
        confidence: 96.2,
        pts: [[120, 520], [310, 520], [310, 680], [120, 680]],
        buildings: [
          { pts: [[145, 545], [285, 545], [285, 650], [145, 650]], color: '#fb923c', height: '8.0m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0109',
        owner: 'Sovereign Residences Block B',
        landUse: 'Residential (Townhouse)',
        areaM2: 480.0,
        areaSqFt: 5166.7,
        perimeterM: 88.0,
        buildingCount: 1,
        bldgAreaM2: 215.0,
        bcr: 44.8,
        status: 'Verified',
        confidence: 97.1,
        pts: [[325, 520], [515, 520], [515, 680], [325, 680]],
        buildings: [
          { pts: [[350, 545], [490, 545], [490, 650], [350, 650]], color: '#fb923c', height: '8.0m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0110',
        owner: 'Municipal Parks & Rec',
        landUse: 'Open Space / Green Buffer',
        areaM2: 1100.0,
        areaSqFt: 11840.3,
        perimeterM: 136.0,
        buildingCount: 0,
        bldgAreaM2: 0,
        bcr: 0.0,
        status: 'Verified',
        confidence: 99.5,
        pts: [[530, 520], [800, 520], [800, 680], [530, 680]],
        buildings: []
      },
      {
        id: 'PAR-2024-0111',
        owner: 'Sunrise Tech Park Annex',
        landUse: 'Commercial Office',
        areaM2: 740.0,
        areaSqFt: 7965.3,
        perimeterM: 112.0,
        buildingCount: 1,
        bldgAreaM2: 410.0,
        bcr: 55.4,
        status: 'Verified',
        confidence: 96.9,
        pts: [[815, 520], [980, 520], [980, 680], [815, 680]],
        buildings: [
          { pts: [[835, 540], [960, 540], [960, 655], [835, 655]], color: '#ea580c', height: '16.5m (G+5)' }
        ]
      },
      {
        id: 'PAR-2024-0112',
        owner: 'Heritage Villa 1',
        landUse: 'Residential (Villa)',
        areaM2: 620.0,
        areaSqFt: 6673.6,
        perimeterM: 102.0,
        buildingCount: 1,
        bldgAreaM2: 240.0,
        bcr: 38.7,
        status: 'Verified',
        confidence: 98.6,
        pts: [[120, 730], [330, 730], [330, 890], [120, 890]],
        buildings: [
          { pts: [[150, 755], [300, 755], [300, 860], [150, 860]], color: '#fb923c', height: '7.5m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0113',
        owner: 'Heritage Villa 2',
        landUse: 'Residential (Villa)',
        areaM2: 600.0,
        areaSqFt: 6458.3,
        perimeterM: 100.0,
        buildingCount: 1,
        bldgAreaM2: 230.0,
        bcr: 38.3,
        status: 'Verified',
        confidence: 97.8,
        pts: [[345, 730], [550, 730], [550, 890], [345, 890]],
        buildings: [
          { pts: [[375, 755], [520, 755], [520, 860], [375, 860]], color: '#fb923c', height: '7.5m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0114',
        owner: 'Skyline Community Hall',
        landUse: 'Public Infrastructure',
        areaM2: 650.0,
        areaSqFt: 6996.5,
        perimeterM: 106.0,
        buildingCount: 1,
        bldgAreaM2: 320.0,
        bcr: 49.2,
        status: 'Verified',
        confidence: 96.0,
        pts: [[565, 730], [770, 730], [770, 890], [565, 890]],
        buildings: [
          { pts: [[590, 755], [745, 755], [745, 860], [590, 860]], color: '#f59e0b', height: '10.0m (G+2)' }
        ]
      },
      {
        id: 'PAR-2024-0115',
        owner: 'City Utility Substation',
        landUse: 'Utility & Infrastructure',
        areaM2: 580.0,
        areaSqFt: 6243.0,
        perimeterM: 98.0,
        buildingCount: 2,
        bldgAreaM2: 180.0,
        bcr: 31.0,
        status: 'Verified',
        confidence: 99.1,
        pts: [[785, 730], [980, 730], [980, 890], [785, 890]],
        buildings: [
          { pts: [[810, 760], [880, 760], [880, 850], [810, 850]], color: '#64748b', height: '5.0m (G)' },
          { pts: [[900, 760], [960, 760], [960, 830], [900, 830]], color: '#64748b', height: '4.0m (G)' }
        ]
      }
    ],
    roads: [
      { pts: [[40, 245], [990, 245], [990, 285], [40, 285]], name: 'Avenue 4 North (18m ROW)' },
      { pts: [[40, 475], [990, 475], [990, 515], [40, 515]], name: 'Central Boulevard (24m ROW)' },
      { pts: [[40, 685], [990, 685], [990, 725], [40, 725]], name: 'Avenue 4 South (18m ROW)' },
      { pts: [[40, 40], [100, 40], [100, 950], [40, 950]], name: 'West Ring Link Road' }
    ]
  },
  {
    id: 'survey-cbd',
    name: 'Commercial CBD & High-Density Mixed Zone',
    location: 'District 2, Financial City Center',
    crs: 'EPSG:32643 (UTM Zone 43N)',
    datum: 'WGS 84 / UTM 43N',
    centerLat: 19.0760,
    centerLon: 72.8777,
    flightAltitude: '150 m AGL',
    gsd: '3.4 cm/px',
    camera: 'Phase One iXM-100 (100 MP)',
    overlap: '85% Forward / 75% Side',
    captureDate: '2026-08-18 11:15 UTC',
    totalAreaHa: 6.15,
    parcelsCount: 10,
    buildingsCount: 16,
    meanConfidence: 97.4,
    boundaryRmse: '0.076 m',
    parcels: [],
    roads: []
  },
  {
    id: 'survey-suburban',
    name: 'Suburban Villa & Agricultural Transition Zone',
    location: 'Zone 9, East Greenbelt Expanse',
    crs: 'EPSG:32643 (UTM Zone 43N)',
    datum: 'WGS 84 / UTM 43N',
    centerLat: 12.9716,
    centerLon: 77.5946,
    flightAltitude: '100 m AGL',
    gsd: '2.4 cm/px',
    camera: 'DJI Zenmuse P1 (45 MP)',
    overlap: '80% Forward / 70% Side',
    captureDate: '2026-08-22 08:45 UTC',
    totalAreaHa: 8.40,
    parcelsCount: 14,
    buildingsCount: 18,
    meanConfidence: 95.9,
    boundaryRmse: '0.091 m',
    parcels: [],
    roads: []
  }
];

DATASETS[1].parcels = DATASETS[0].parcels.slice(0, 10);
DATASETS[1].roads = DATASETS[0].roads.slice(0, 3);
DATASETS[2].parcels = DATASETS[0].parcels.slice(0, 14);
DATASETS[2].roads = DATASETS[0].roads.slice(0, 3);

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupUploadDropzone();
  setupGisCanvas();
  setupInspector();
  setupExportTriggers();
  setupSearchAndFilters();
  renderDashboardStats();
  renderPreviewCanvas();
  renderGisMap();
  populateRegistryTable();
});

// --- NAVIGATION ---
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetScreen = item.getAttribute('data-screen');
      if (targetScreen) navigateToScreen(targetScreen);
    });
  });
}

function navigateToScreen(screenId) {
  AppState.activeScreen = screenId;
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-screen') === screenId) item.classList.add('active');
    else item.classList.remove('active');
  });

  document.querySelectorAll('.screen-view').forEach(view => {
    if (view.id === `screen-${screenId}`) view.classList.add('active');
    else view.classList.remove('active');
  });

  if (screenId === 'result') setTimeout(renderGisMap, 60);
  else if (screenId === 'upload') setTimeout(renderPreviewCanvas, 60);
}

// --- SCREEN 1: DASHBOARD ---
function renderDashboardStats() {
  const ds = DATASETS[AppState.activeDatasetIndex];
  const pCount = document.getElementById('stat-parcels');
  if (pCount) pCount.textContent = ds.parcelsCount;
  const bCount = document.getElementById('stat-buildings');
  if (bCount) bCount.textContent = ds.buildingsCount;
  const areaStat = document.getElementById('stat-area');
  if (areaStat) areaStat.textContent = `${ds.totalAreaHa} ha`;
  const confStat = document.getElementById('stat-confidence');
  if (confStat) confStat.textContent = `${ds.meanConfidence}%`;
  const badge = document.getElementById('header-dataset-name');
  if (badge) badge.textContent = ds.name;
}

// --- SCREEN 2: UPLOAD & PRESETS ---
function setupUploadDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  if (!dropzone) return;

  dropzone.addEventListener('click', () => fileInput && fileInput.click());
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0].name);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelected(e.target.files[0].name);
      }
    });
  }

  document.querySelectorAll('.preset-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      AppState.activeDatasetIndex = idx;
      updateSurveyMetadataForm();
      renderDashboardStats();
      renderPreviewCanvas();
      populateRegistryTable();
      showToast(`Loaded Preset: ${DATASETS[idx].name}`);
    });
  });
}

function handleFileSelected(filename) {
  showToast(`Loaded drone orthomosaic: ${filename}`);
  renderPreviewCanvas();
}

function updateSurveyMetadataForm() {
  const ds = DATASETS[AppState.activeDatasetIndex];
  document.getElementById('meta-altitude').value = ds.flightAltitude;
  document.getElementById('meta-gsd').value = ds.gsd;
  document.getElementById('meta-crs').value = ds.crs;
  document.getElementById('meta-sensor').value = ds.camera;
  document.getElementById('meta-overlap').value = ds.overlap;
}

// --- DRONE ORTHOMOSAIC CANVAS RENDERER ---
function renderProceduralDroneImage(ctx, width, height) {
  ctx.fillStyle = '#2d4a2d';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 350; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(34, 60, 30, 0.4)' : 'rgba(70, 95, 45, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const ds = DATASETS[AppState.activeDatasetIndex];
  ds.roads.forEach(road => {
    ctx.fillStyle = '#22262c';
    ctx.beginPath();
    road.pts.forEach((p, idx) => {
      const rx = (p[0] / 1000) * width;
      const ry = (p[1] / 1000) * height;
      if (idx === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    });
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    const midY = ((road.pts[0][1] + road.pts[2][1]) / 2 / 1000) * height;
    const startX = (road.pts[0][0] / 1000) * width;
    const endX = (road.pts[1][0] / 1000) * width;
    ctx.moveTo(startX + 10, midY);
    ctx.lineTo(endX - 10, midY);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ds.parcels.forEach(parcel => {
    ctx.save();
    ctx.beginPath();
    parcel.pts.forEach((p, idx) => {
      const px = (p[0] / 1000) * width;
      const py = (p[1] / 1000) * height;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = parcel.landUse.includes('Commercial') ? '#3f4f66' : '#325832';
    ctx.fillRect(0, 0, width, height);

    const minX = (parcel.pts[0][0] / 1000) * width;
    const minY = (parcel.pts[0][1] / 1000) * height;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(minX + 8, minY + 8, 22, 40);

    ctx.fillStyle = '#1e3a1e';
    ctx.beginPath();
    ctx.arc(minX + 36, minY + 22, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    parcel.buildings.forEach(b => {
      const bx = (b.pts[0][0] / 1000) * width;
      const by = (b.pts[0][1] / 1000) * height;
      const bw = ((b.pts[1][0] - b.pts[0][0]) / 1000) * width;
      const bh = ((b.pts[2][1] - b.pts[1][1]) / 1000) * height;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(bx + 8, by + 8, bw, bh);

      ctx.fillStyle = b.color;
      ctx.fillRect(bx, by, bw, bh);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

      ctx.beginPath();
      ctx.moveTo(bx + bw / 2, by + 3);
      ctx.lineTo(bx + bw / 2, by + bh - 3);
      ctx.stroke();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(bx + 6, by + 6, bw * 0.35, bh * 0.3);
    });
  });
}

function renderPreviewCanvas() {
  const canvas = document.getElementById('preview-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;
  renderProceduralDroneImage(ctx, 600, 400);
}

// --- SCREEN 3: PROCESSING SIMULATION ---
function startAiProcessing() {
  navigateToScreen('processing');
  AppState.isProcessing = true;
  AppState.processingProgress = 0;

  const stages = [
    { name: 'Image Preprocessing & CLAHE Radiometric Calibration', duration: 700, log: 'Applying CLAHE contrast stretching & 512x512 GeoTIFF tiling... CRS: EPSG:32643' },
    { name: 'Building Footprint Detection (YOLOv8-Seg)', duration: 900, log: 'TensorRT FP16 Inference: Extracted 22 building rooftop mask polygons (Confidence: 98.4%)' },
    { name: 'Cadastral Boundary Delineation (Voronoi & Graph-Cut)', duration: 800, log: 'Constructing planar cadastral graph... 15 legal parcel boundary polygons traced.' },
    { name: 'Road Network & ROW Extraction (DeepLabV3+)', duration: 750, log: 'Centerline tracing completed: 4 major transport corridors and right-of-way buffers vectorized.' },
    { name: 'Polygon Regularization & Topological Cleaning', duration: 700, log: 'Douglas-Peucker simplification (epsilon=0.04). Zero sliver polygons and no overlap violations.' },
    { name: 'Geospatial Attribute Assignment & GeoJSON Encoding', duration: 600, log: 'Assigned Cadastral IDs PAR-2024-0101 through 0115. Total Area: 4.82 ha. Pipeline finished in 4.45s.' }
  ];

  let currentStageIdx = 0;
  const progressBar = document.getElementById('progress-bar-fill');
  const stageNodes = document.querySelectorAll('.stage-node');
  const terminal = document.getElementById('processing-terminal');
  if (terminal) terminal.innerHTML = '';

  function executeStage() {
    if (currentStageIdx >= stages.length) {
      AppState.isProcessing = false;
      setTimeout(() => {
        showToast('AI Cadastral Pipeline Completed Successfully!');
        navigateToScreen('result');
      }, 500);
      return;
    }

    const stage = stages[currentStageIdx];
    const stageTitle = document.getElementById('current-stage-title');
    if (stageTitle) stageTitle.textContent = `Stage ${currentStageIdx + 1}/6: ${stage.name}`;

    stageNodes.forEach((node, idx) => {
      node.classList.remove('active');
      const st = node.querySelector('.stage-node-status');
      if (idx < currentStageIdx) {
        node.classList.add('completed');
        if (st) st.textContent = 'DONE';
      } else if (idx === currentStageIdx) {
        node.classList.add('active');
        if (st) st.textContent = 'RUNNING...';
      } else {
        node.classList.remove('completed');
        if (st) st.textContent = 'WAITING';
      }
    });

    if (terminal) {
      const timeStr = new Date().toISOString().substring(11, 19);
      const logLine = document.createElement('div');
      logLine.className = 'log-line';
      logLine.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-info">[STAGE ${currentStageIdx+1}]</span> ${stage.log}`;
      terminal.appendChild(logLine);
      terminal.scrollTop = terminal.scrollHeight;
    }

    const progressTarget = Math.round(((currentStageIdx + 1) / stages.length) * 100);
    if (progressBar) progressBar.style.width = `${progressTarget}%`;
    const percentTxt = document.getElementById('progress-percent');
    if (percentTxt) percentTxt.textContent = `${progressTarget}%`;

    currentStageIdx++;
    setTimeout(executeStage, stage.duration);
  }

  executeStage();
}

// --- SCREEN 4: GIS INTERACTIVE CANVAS ---
let gisCanvas, gisCtx;

function setupGisCanvas() {
  gisCanvas = document.getElementById('gis-main-canvas');
  if (!gisCanvas) return;
  gisCtx = gisCanvas.getContext('2d');

  window.addEventListener('resize', () => {
    if (AppState.activeScreen === 'result') renderGisMap();
  });

  gisCanvas.addEventListener('mousedown', (e) => {
    if (AppState.activeTool === 'measure-dist' || AppState.activeTool === 'measure-area') {
      const pos = getCanvasMousePos(e);
      AppState.measurePoints.push(pos);
      renderGisMap();
      return;
    }
    AppState.isDraggingMap = true;
    AppState.dragStart = { x: e.clientX - AppState.mapPan.x, y: e.clientY - AppState.mapPan.y };
  });

  window.addEventListener('mousemove', (e) => {
    if (AppState.isDraggingSlider) {
      const rect = gisCanvas.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      ratio = Math.max(0.02, Math.min(0.98, ratio));
      AppState.splitRatio = ratio;
      const sLine = document.getElementById('split-slider-line');
      if (sLine) sLine.style.left = `${ratio * 100}%`;
      renderGisMap();
      return;
    }

    if (AppState.isDraggingMap) {
      AppState.mapPan.x = e.clientX - AppState.dragStart.x;
      AppState.mapPan.y = e.clientY - AppState.dragStart.y;
      renderGisMap();
    }

    const rect = gisCanvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      const ds = DATASETS[AppState.activeDatasetIndex];
      const curLat = (ds.centerLat + (0.5 - normY) * 0.004).toFixed(6);
      const curLon = (ds.centerLon + (normX - 0.5) * 0.005).toFixed(6);
      const coordsBar = document.getElementById('status-cursor-coords');
      if (coordsBar) {
        coordsBar.textContent = `Lat: ${curLat}° N, Lon: ${curLon}° E | UTM: 43R 714${Math.floor(normX * 800)}m E, 3167${Math.floor(normY * 800)}m N`;
      }
    }
  });

  window.addEventListener('mouseup', () => {
    AppState.isDraggingMap = false;
    AppState.isDraggingSlider = false;
  });

  gisCanvas.addEventListener('click', (e) => {
    if (AppState.activeTool !== 'select') return;
    const clickPos = getCanvasMousePos(e);
    const clickedParcel = findParcelAt(clickPos.x, clickPos.y);
    if (clickedParcel) {
      AppState.selectedParcelId = clickedParcel.id;
      updateInspectorWithParcel(clickedParcel);
      renderGisMap();
      showToast(`Selected Parcel: ${clickedParcel.id}`);
    }
  });

  gisCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    AppState.mapZoom = Math.max(0.6, Math.min(4.0, AppState.mapZoom * zoomFactor));
    renderGisMap();
  });

  const sliderLine = document.getElementById('split-slider-line');
  if (sliderLine) {
    sliderLine.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      AppState.isDraggingSlider = true;
    });
  }

  document.querySelectorAll('.layer-toggle-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const layerName = e.target.getAttribute('data-layer');
      if (layerName) {
        AppState.layers[layerName] = e.target.checked;
        renderGisMap();
      }
    });
  });

  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = btn.getAttribute('data-tool');
      if (tool) {
        AppState.activeTool = tool;
        if (tool !== 'measure-dist' && tool !== 'measure-area') {
          AppState.measurePoints = [];
        }
        showToast(`Tool: ${btn.title || tool}`);
        renderGisMap();
      }
    });
  });
}

function getCanvasMousePos(e) {
  const rect = gisCanvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const transformedX = (rawX - centerX - AppState.mapPan.x) / AppState.mapZoom + centerX;
  const transformedY = (rawY - centerY - AppState.mapPan.y) / AppState.mapZoom + centerY;

  const normX = (transformedX / rect.width) * 1000;
  const normY = (transformedY / rect.height) * 1000;

  return { x: normX, y: normY, screenX: rawX, screenY: rawY };
}

function findParcelAt(normX, normY) {
  const ds = DATASETS[AppState.activeDatasetIndex];
  for (let i = ds.parcels.length - 1; i >= 0; i--) {
    const p = ds.parcels[i];
    if (isPointInPoly([normX, normY], p.pts)) return p;
  }
  return null;
}

function isPointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
      (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function renderGisMap() {
  if (!gisCanvas) return;
  const container = document.getElementById('gis-canvas-container');
  if (!container) return;

  gisCanvas.width = container.clientWidth;
  gisCanvas.height = container.clientHeight;
  const width = gisCanvas.width;
  const height = gisCanvas.height;

  gisCtx.clearRect(0, 0, width, height);

  gisCtx.save();
  gisCtx.translate(width / 2 + AppState.mapPan.x, height / 2 + AppState.mapPan.y);
  gisCtx.scale(AppState.mapZoom, AppState.mapZoom);
  gisCtx.translate(-width / 2, -height / 2);

  if (AppState.layers.ortho) {
    renderProceduralDroneImage(gisCtx, width, height);
  } else {
    gisCtx.fillStyle = '#0a1124';
    gisCtx.fillRect(0, 0, width, height);
  }

  const ds = DATASETS[AppState.activeDatasetIndex];

  // Roads Layer
  if (AppState.layers.roads) {
    ds.roads.forEach(road => {
      gisCtx.fillStyle = 'rgba(250, 204, 21, 0.25)';
      gisCtx.strokeStyle = '#facc15';
      gisCtx.lineWidth = 2;
      gisCtx.beginPath();
      road.pts.forEach((p, idx) => {
        const rx = (p[0] / 1000) * width;
        const ry = (p[1] / 1000) * height;
        if (idx === 0) gisCtx.moveTo(rx, ry);
        else gisCtx.lineTo(rx, ry);
      });
      gisCtx.closePath();
      gisCtx.fill();
      gisCtx.stroke();
    });
  }

  // Parcels Layer
  if (AppState.layers.parcels) {
    ds.parcels.forEach(p => {
      const isSelected = p.id === AppState.selectedParcelId;

      gisCtx.beginPath();
      p.pts.forEach((pt, idx) => {
        const px = (pt[0] / 1000) * width;
        const py = (pt[1] / 1000) * height;
        if (idx === 0) gisCtx.moveTo(px, py);
        else gisCtx.lineTo(px, py);
      });
      gisCtx.closePath();

      if (isSelected) {
        gisCtx.fillStyle = 'rgba(0, 242, 254, 0.38)';
        gisCtx.strokeStyle = '#00f2fe';
        gisCtx.lineWidth = 3;
        gisCtx.shadowColor = '#00f2fe';
        gisCtx.shadowBlur = 10;
      } else {
        gisCtx.fillStyle = 'rgba(0, 210, 255, 0.18)';
        gisCtx.strokeStyle = '#00d2ff';
        gisCtx.lineWidth = 1.5;
        gisCtx.shadowBlur = 0;
      }
      gisCtx.fill();
      gisCtx.stroke();
      gisCtx.shadowBlur = 0;

      if (AppState.layers.dimensions) {
        const cX = ((p.pts[0][0] + p.pts[1][0]) / 2 / 1000) * width;
        const cY = ((p.pts[0][1] + p.pts[2][1]) / 2 / 1000) * height;

        gisCtx.fillStyle = isSelected ? '#ffffff' : '#00f2fe';
        gisCtx.font = `bold ${Math.max(10, 11 * AppState.mapZoom)}px 'JetBrains Mono', monospace`;
        gisCtx.textAlign = 'center';
        gisCtx.fillText(p.id, cX, cY - 3);

        gisCtx.fillStyle = '#94a3b8';
        gisCtx.font = `${Math.max(8, 9 * AppState.mapZoom)}px sans-serif`;
        gisCtx.fillText(`${p.areaM2} m²`, cX, cY + 10);
      }

      if (AppState.layers.vertices || isSelected) {
        p.pts.forEach(pt => {
          const vx = (pt[0] / 1000) * width;
          const vy = (pt[1] / 1000) * height;
          gisCtx.fillStyle = '#a855f7';
          gisCtx.strokeStyle = '#ffffff';
          gisCtx.lineWidth = 1;
          gisCtx.beginPath();
          gisCtx.arc(vx, vy, 3.5, 0, Math.PI * 2);
          gisCtx.fill();
          gisCtx.stroke();
        });
      }
    });
  }

  // Buildings Layer
  if (AppState.layers.buildings) {
    ds.parcels.forEach(p => {
      p.buildings.forEach(b => {
        gisCtx.beginPath();
        b.pts.forEach((pt, idx) => {
          const bx = (pt[0] / 1000) * width;
          const by = (pt[1] / 1000) * height;
          if (idx === 0) gisCtx.moveTo(bx, by);
          else gisCtx.lineTo(bx, by);
        });
        gisCtx.closePath();

        gisCtx.fillStyle = 'rgba(251, 146, 60, 0.55)';
        gisCtx.strokeStyle = '#fb923c';
        gisCtx.lineWidth = 1.5;
        gisCtx.fill();
        gisCtx.stroke();
      });
    });
  }

  // Measurement Overlay
  if (AppState.measurePoints.length > 0) {
    gisCtx.strokeStyle = '#f43f5e';
    gisCtx.fillStyle = 'rgba(244, 63, 94, 0.2)';
    gisCtx.lineWidth = 2;
    gisCtx.beginPath();
    AppState.measurePoints.forEach((pt, idx) => {
      const mx = (pt.x / 1000) * width;
      const my = (pt.y / 1000) * height;
      if (idx === 0) gisCtx.moveTo(mx, my);
      else gisCtx.lineTo(mx, my);
    });
    if (AppState.activeTool === 'measure-area' && AppState.measurePoints.length > 2) {
      gisCtx.closePath();
      gisCtx.fill();
    }
    gisCtx.stroke();

    AppState.measurePoints.forEach(pt => {
      const mx = (pt.x / 1000) * width;
      const my = (pt.y / 1000) * height;
      gisCtx.fillStyle = '#f43f5e';
      gisCtx.beginPath();
      gisCtx.arc(mx, my, 4.5, 0, Math.PI * 2);
      gisCtx.fill();
    });
  }

  gisCtx.restore();
}

// --- SCREEN 4: PROPERTY INSPECTOR ---
function setupInspector() {
  const ds = DATASETS[AppState.activeDatasetIndex];
  const initialParcel = ds.parcels.find(p => p.id === AppState.selectedParcelId) || ds.parcels[0];
  if (initialParcel) updateInspectorWithParcel(initialParcel);
}

function updateInspectorWithParcel(parcel) {
  document.getElementById('insp-parcel-id').textContent = parcel.id;
  document.getElementById('insp-owner').textContent = parcel.owner;
  document.getElementById('insp-landuse').textContent = parcel.landUse;
  document.getElementById('insp-area-m2').textContent = `${parcel.areaM2.toFixed(1)} m²`;
  document.getElementById('insp-area-sqft').textContent = `${parcel.areaSqFt.toFixed(1)} sq ft`;
  document.getElementById('insp-perimeter').textContent = `${parcel.perimeterM.toFixed(1)} m`;
  document.getElementById('insp-buildings').textContent = parcel.buildingCount;
  document.getElementById('insp-bldg-area').textContent = `${parcel.bldgAreaM2.toFixed(1)} m²`;
  document.getElementById('insp-bcr').textContent = `${parcel.bcr.toFixed(1)}%`;
  document.getElementById('insp-status').textContent = parcel.status;
  document.getElementById('insp-confidence').textContent = `${parcel.confidence}%`;

  const tbody = document.getElementById('insp-vertex-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    const ds = DATASETS[AppState.activeDatasetIndex];
    parcel.pts.forEach((pt, idx) => {
      const lat = (ds.centerLat + (0.5 - pt[1] / 1000) * 0.004).toFixed(6);
      const lon = (ds.centerLon + (pt[0] / 1000 - 0.5) * 0.005).toFixed(6);
      const row = document.createElement('tr');
      row.innerHTML = `<td>V${idx+1}</td><td>${lat}° N</td><td>${lon}° E</td>`;
      tbody.appendChild(row);
    });
  }
}

// --- SCREEN 5: REGISTRY TABLE & SEARCH ---
function populateRegistryTable() {
  const tbody = document.getElementById('registry-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const ds = DATASETS[AppState.activeDatasetIndex];
  ds.parcels.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-family: var(--font-mono); font-weight: 700; color: #00f2fe;">${p.id}</td>
      <td>${p.owner}</td>
      <td><span class="status-tag verified">${p.landUse}</span></td>
      <td style="font-family: var(--font-mono);">${p.areaM2} m²</td>
      <td style="font-family: var(--font-mono);">${p.perimeterM} m</td>
      <td>${p.buildingCount}</td>
      <td style="font-family: var(--font-mono); color: #10b981;">${p.confidence}%</td>
      <td><button class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px;" onclick="inspectFromTable('${p.id}')">Inspect</button></td>
    `;
    tbody.appendChild(row);
  });
}

window.inspectFromTable = function(parcelId) {
  AppState.selectedParcelId = parcelId;
  const ds = DATASETS[AppState.activeDatasetIndex];
  const p = ds.parcels.find(item => item.id === parcelId);
  if (p) updateInspectorWithParcel(p);
  navigateToScreen('result');
  showToast(`Inspecting ${parcelId}`);
};

function setupSearchAndFilters() {
  const searchInput = document.getElementById('registry-search');
  const filterSelect = document.getElementById('registry-filter');

  function filterTable() {
    const query = (searchInput.value || '').toLowerCase();
    const landUseFilter = filterSelect.value;
    const ds = DATASETS[AppState.activeDatasetIndex];

    const filtered = ds.parcels.filter(p => {
      const matchQuery = p.id.toLowerCase().includes(query) || p.owner.toLowerCase().includes(query) || p.landUse.toLowerCase().includes(query);
      const matchFilter = (landUseFilter === 'all') || p.landUse.toLowerCase().includes(landUseFilter.toLowerCase());
      return matchQuery && matchFilter;
    });

    const tbody = document.getElementById('registry-table-body');
    tbody.innerHTML = '';
    filtered.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-family: var(--font-mono); font-weight: 700; color: #00f2fe;">${p.id}</td>
        <td>${p.owner}</td>
        <td><span class="status-tag verified">${p.landUse}</span></td>
        <td style="font-family: var(--font-mono);">${p.areaM2} m²</td>
        <td style="font-family: var(--font-mono);">${p.perimeterM} m</td>
        <td>${p.buildingCount}</td>
        <td style="font-family: var(--font-mono); color: #10b981;">${p.confidence}%</td>
        <td><button class="btn btn-secondary" style="padding: 3px 8px; font-size: 11px;" onclick="inspectFromTable('${p.id}')">Inspect</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (filterSelect) filterSelect.addEventListener('change', filterTable);
}

// --- EXPORT ENGINES ---
function setupExportTriggers() {
  document.getElementById('btn-export-geojson')?.addEventListener('click', downloadGeoJson);
  document.getElementById('btn-export-csv')?.addEventListener('click', downloadCsv);
  document.getElementById('btn-export-report')?.addEventListener('click', openCadastralReportModal);
  document.getElementById('btn-close-report')?.addEventListener('click', closeCadastralReportModal);
  document.getElementById('btn-print-report')?.addEventListener('click', () => window.print());
  document.getElementById('btn-analyze-image')?.addEventListener('click', startAiProcessing);
  document.getElementById('btn-hero-upload')?.addEventListener('click', () => navigateToScreen('upload'));
  document.getElementById('btn-hero-demo')?.addEventListener('click', () => navigateToScreen('result'));
}

function downloadGeoJson() {
  const ds = DATASETS[AppState.activeDatasetIndex];
  const geojson = {
    type: 'FeatureCollection',
    name: ds.name,
    crs: {
      type: 'name',
      properties: { name: ds.crs }
    },
    features: ds.parcels.map(p => {
      const coordinates = p.pts.map(pt => {
        const lon = parseFloat((ds.centerLon + (pt[0] / 1000 - 0.5) * 0.005).toFixed(6));
        const lat = parseFloat((ds.centerLat + (0.5 - pt[1] / 1000) * 0.004).toFixed(6));
        return [lon, lat];
      });
      coordinates.push(coordinates[0]);

      return {
        type: 'Feature',
        properties: {
          parcel_id: p.id,
          owner: p.owner,
          land_use: p.landUse,
          area_m2: p.areaM2,
          perimeter_m: p.perimeterM,
          building_count: p.buildingCount,
          building_area_m2: p.bldgAreaM2,
          coverage_ratio_bcr: p.bcr,
          confidence: p.confidence,
          legal_status: p.status
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      };
    })
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cadastral_${ds.id}_vector.geojson`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded GeoJSON vector dataset successfully!');
}

function downloadCsv() {
  const ds = DATASETS[AppState.activeDatasetIndex];
  let csv = 'Parcel_ID,Owner,Land_Use,Area_m2,Area_sqft,Perimeter_m,Building_Count,Building_Area_m2,BCR_Percent,Confidence,Legal_Status\n';
  
  ds.parcels.forEach(p => {
    csv += `"${p.id}","${p.owner}","${p.landUse}",${p.areaM2},${p.areaSqFt},${p.perimeterM},${p.buildingCount},${p.bldgAreaM2},${p.bcr},${p.confidence},"${p.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cadastral_${ds.id}_registry.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Exported Cadastral CSV Registry successfully!');
}

function openCadastralReportModal() {
  const modal = document.getElementById('report-modal');
  const ds = DATASETS[AppState.activeDatasetIndex];
  
  document.getElementById('cert-dataset-name').textContent = ds.name;
  document.getElementById('cert-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('cert-crs').textContent = ds.crs;
  document.getElementById('cert-gsd').textContent = ds.gsd;
  document.getElementById('cert-parcels').textContent = ds.parcelsCount;
  document.getElementById('cert-area').textContent = `${ds.totalAreaHa} ha (${(ds.totalAreaHa * 10000).toFixed(0)} m²)`;
  document.getElementById('cert-rmse').textContent = ds.boundaryRmse;
  document.getElementById('cert-confidence').textContent = `${ds.meanConfidence}%`;

  const tbody = document.getElementById('cert-table-body');
  tbody.innerHTML = '';
  ds.parcels.slice(0, 8).forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight: 700;">${p.id}</td>
      <td>${p.owner}</td>
      <td>${p.landUse}</td>
      <td>${p.areaM2} m²</td>
      <td>${p.buildingCount}</td>
      <td>${p.bcr}%</td>
      <td>${p.status}</td>
    `;
    tbody.appendChild(row);
  });

  modal.classList.add('active');
}

function closeCadastralReportModal() {
  document.getElementById('report-modal').classList.remove('active');
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color: #38bdf8;">✔</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
