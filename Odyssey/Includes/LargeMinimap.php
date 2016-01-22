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
    echo "     <img src=\"Odyssey/Images/Minimap/Map" . $floorID . ".png\" id=\"MinimapFloor" . $floorID . "\" class=\"" . ($isActive ? "active" : "inactive") . "\" draggable=\"false\" />\n";
}
?>
<!-- todo remove -->
     <img src="Odyssey/Images/Minimap/Map01.png" id="MinimapFloor01" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map02.png" id="MinimapFloor02" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map03.png" id="MinimapFloor03" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map04.png" id="MinimapFloor04" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map05.png" id="MinimapFloor05" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map06.png" id="MinimapFloor06" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map07.png" id="MinimapFloor07" class="active" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map08.png" id="MinimapFloor08" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map09.png" id="MinimapFloor09" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map10.png" id="MinimapFloor10" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map11.png" id="MinimapFloor11" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map12.png" id="MinimapFloor12" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map13.png" id="MinimapFloor13" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map14.png" id="MinimapFloor14" class="inactive" draggable="false" />
     <img src="Odyssey/Images/Minimap/Map15.png" id="MinimapFloor15" class="inactive" draggable="false" />
    </div>
   </div>
  </div>