# Earth texture sources and fallback behavior

## Primary runtime textures

The intro requests these assets from the version-pinned Three.js example texture set (`r168`):

- `earth_atmos_2048.jpg` — satellite-mosaic surface color map.
- `earth_normal_2048.jpg` — surface normal map for terrain relief.
- `earth_specular_2048.jpg` — ocean/land specular response map.
- `earth_clouds_1024.png` — cloud coverage alpha map for the lower cloud deck and its subtle surface-shadow pass.

Source directory: https://github.com/mrdoob/three.js/tree/r168/examples/textures/planets

NASA describes Blue Marble imagery as a true-color Earth mosaic assembled from satellite observations, including MODIS observations: https://science.nasa.gov/resource/blue-marble/ . The Three.js sample textures are used as visual Earth maps; the website does not present them as live satellite data.

## Bundled local maps

If the remote texture host is unavailable, the intro loads `earth-surface.jpg`, `earth-height.jpg`, and `earth-clouds.png` from this folder. The local lower cloud map (`earth-clouds.png`) and sparse high-altitude cirrus map (`earth-clouds-high.png`) are seamless, procedurally generated coverage masks made for this portfolio using multi-scale periodic noise. They are visual cloud layers, not weather data or scientific observations. The local surface and relief fallbacks are illustrative maps generated from public Natural Earth vector geography and procedural terrain; they are not satellite photographs or measured elevation data. Natural Earth vector data is public domain.
