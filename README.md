# Odyssey
Tile map renderer for the MMORPG Tibia.

## Demo
A demonstration can be found at http://tibiaodyssey.com.

## Maps
Maps are generated externally and stored in the ./Odyssey/Maps directory. These files are in JSON format with the following information:

Field | Description
------|-------------
BaseX | The X position this map file starts at.
BaseY | The Y position this map file starts at.
BaseZ | The Z position this map file starts at.
Items | An array of all the unique item IDs in this map file.
Explored | An array of integers, indicating which tiles have been explored. Each integer is a set of 32 bit flags.
Map | The map tiles, with unexplored tiles filtered out. Use *Explored* to determine where each item belongs.

Map files contain information about 256 * 256 * 1 = 65536 map tiles.

### PNG Files
Static \*.png files of the minimap are generated and stored in the ./Odyssey/Images/Minimap directory. These images are used for the large minimap display, but **not** the small minimap, which is a drawn canvas.

## Game Data
Game data, such as sprites, are based on the Flash Client.
