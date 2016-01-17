<?php
const RADIUS_SIZE_X = 18;
const RADIUS_SIZE_Y = 10;
?>
     <div id="map-grid">
<?php
for ($x = -RADIUS_SIZE_X; $x <= RADIUS_SIZE_Y; $x++) {
    for ($y = -RADIUS_SIZE_Y; $y <= RADIUS_SIZE_Y; $y++) {
        echo "      <div data-grid-x=\"" . $x . "\" data-grid-y=\"" . $y . "\"></div>\n";
    }
}
?>
     </div>
