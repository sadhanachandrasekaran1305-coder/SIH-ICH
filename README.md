# AI-Based Automated Urban Parcel Mapping & Cadastral Feature Extraction using Drone Imagery

A high-fidelity, functional desktop GIS and Computer Vision web application prototype that demonstrates the complete photogrammetric surveying and automated cadastral feature extraction workflow from aerial UAV orthomosaics.

---

## 🚀 Key Features

1. **Screen 1: Dashboard & Workflow Visualizer**
   - High-level project summary and photogrammetric surveying context.
   - Interactive 6-step aerial pipeline diagram from raw UAV orthomosaics to legal cadastre.
   - Real-time survey KPIs (Total Parcels, Buildings, Mapped Hectares, Model Accuracy).
   - Recent flight survey registry table with one-click analysis loading.

2. **Screen 2: Drone Image Upload & Photogrammetry Setup**
   - Interactive drag-and-drop upload zone for GeoTIFF, PNG, and JPG aerial orthomosaics.
   - 3 pre-calibrated UAV benchmark datasets (Sector 4 Residential, Commercial CBD, Suburban Greenbelt).
   - Real-time aerial canvas preview with coordinates and GSD telemetry.
   - Sensor parameter configuration (Flight Altitude, GSD cm/px, CRS EPSG:32643, Camera Sensor, Overlap ratio).

3. **Screen 3: AI Inference & Geospatial Processing Pipeline**
   - Step-by-step animated inference monitor with percentage progress bar.
   - 6-stage sequential pipeline:
     1. Image Preprocessing & CLAHE Radiometric Calibration
     2. Building Footprint Detection (YOLOv8-Seg)
     3. Cadastral Boundary Delineation (Voronoi & Graph-Cut)
     4. Road Network & ROW Extraction (DeepLabV3+)
     5. Polygon Regularization & Topological Cleaning
     6. Geospatial Attribute Assignment & GeoJSON Encoding
   - Live streaming terminal log with tensor shapes, GPU telemetry (NVIDIA RTX 4090), inference latency, and detected polygon counters.

4. **Screen 4: GIS Map & Vectors (Core Highlight)**
   - High-resolution drone orthomosaic canvas engine.
   - Vector overlays:
     - 🟦 **Cadastral Parcel Boundaries** (Cyan polygonal strokes, semi-transparent fills, centroid Parcel IDs, and calculated area in $m^2$).
     - 🏠 **Building Footprints** (Amber/Coral rooftops with 3D height extrusion and confidence scores).
     - 🛣️ **Road Networks** (Gold corridor bands and dashed centerlines).
     - 📍 **Vertex Coordinate Pins** and boundary dimension tags.
   - **Before / After Split Swipe Curtain Slider**: Interactive comparison between raw drone imagery and AI vector cadastre.
   - **Interactive GIS Toolbar**: Select/Inspect, Distance measurement polyline, Area measurement polygon, Layer visibility toggles, Zoom In/Out, Reset Extent.
   - **Dynamic Cursor Status Bar**: Real-time cursor Latitude/Longitude, UTM coordinates, and scale bar.
   - **Parcel Property Inspector Drawer**: Detailed property metadata, Land-Use classification, Building Footprint Area, Building Coverage Ratio (FAR/BCR), and dynamic Cadastral Vertex Coordinate Table.

5. **Screen 5: Cadastral Report & Analytics Hub**
   - Land-Use spatial distribution breakdown (Residential, Commercial, Public Infrastructure, Green Buffer).
   - Accuracy metrics (Boundary RMSE < 0.082m, 100% topological closure).
   - Searchable and filterable Cadastral Registry Table with instant parcel inspection.
   - Real functioning export engines:
     - 🌐 **Download GeoJSON** (OGC RFC-7946 compliant FeatureCollection).
     - 📊 **Export CSV** (RFC-4180 spreadsheet with parcel IDs, owners, areas, BCR).
     - 📄 **Download Cadastral Report** (Print-ready official survey certificate with surveyor signoff).

6. **Screen 6: Technology Architecture**
   - Detailed visual breakdown of the end-to-end implementation stack:
     `HTML + CSS + JavaScript Canvas GIS → Python 3.11 + Flask/FastAPI → OpenCV + GDAL → YOLOv8-Seg + SAM → GeoPandas + Shapely + Folium`

---

## 📂 Project Structure

```
cadastral-mapping-app/
├── index.html          # Main application desktop interface (5 screens + modals)
├── styles.css          # Modern dark navy GIS design system & glassmorphism
├── app.js              # Complete GIS vector engine, canvas renderer, & export logic
├── README.md           # Technical documentation and architecture guide
└── sample_data/
    ├── sample_survey.geojson   # Exported GeoJSON vector dataset
    └── sample_registry.csv     # Exported CSV land registry schedule
```

---

## 🛠️ How to Run

1. Open `index.html` directly in any modern desktop web browser (Chrome, Edge, Firefox, Safari).
2. No external web server or build step is required — the application is fully functional and standalone.
