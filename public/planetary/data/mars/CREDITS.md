# Mars data credits

## Bundled products

| File | Description |
|------|-------------|
| `mola_topo_preview.jpg` | Global cylindrical MOLA topography visualization (NASA / MOLA Science Team) |
| `viking_color.jpg` | Global Viking orbiter color mosaic — NASA/JPL/USGS **PIA00407** (public domain) |

Height source: [Marsoweb global data maps](https://marsoweb.nas.nasa.gov/globalData/) · MGS/MOLA  
Color source: [PIA00407](https://photojournal.jpl.nasa.gov/catalog/PIA00407)

Elevation decoding maps MOLA luminance into approximately −8 km … +21 km (educational range). **Not** a MEGDR binary DEM — use PDS MEGDR for research.

## Flagship pads

Jezero, Olympus Mons, and Valles Marineris ship with baked hybrid height grids (`public/data/mars/pads/*.png` + `.meta.json`) for denser walking LOD. These are **educational** (not HiRISE / MEGDR research products). Regenerate with `npm run bake:pads`.

## Landmarks

Coordinates and elevations approximate published NASA / USGS values for education.

## Procedural detail

Walking-scale micro-relief, rocks, and grit are generated at runtime and labeled in the HUD.
