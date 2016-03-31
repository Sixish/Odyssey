<?php
const DEFAULT_ACTIVE_FLOOR = 7;
$min_floor = 0;
$max_floor = 15;
?>
  <div id="OdysseyLargeMinimap">
   <div id="OdysseyMinimapViewport">
    <div id="OdysseyMinimapClose" class="OdysseyContainer">
     <a href="#" id="OdysseyMinimapCloseLink">Close</a>
    </div>
    <div id="OdysseyMinimapContainer">
     <div id="OdysseyMinimapActive"></div>
<?php
for ($i = $min_floor; $i < $max_floor; $i++) {
    $floorID = str_pad("" . $i, 2, '0', STR_PAD_LEFT);
    $isActive = ($i == DEFAULT_ACTIVE_FLOOR);
    echo "     <img data-src=\"Odyssey/Images/Minimap/Map" . $floorID . ".png\" id=\"MinimapFloor" . $floorID . "\" class=\"" . ($isActive ? "active" : "inactive") . "\" draggable=\"false\" />\n";
}
?>
    </div>
   </div>
  </div>