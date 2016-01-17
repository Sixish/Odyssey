<?php
const MAX_ITEM_INFO_DISPLAY = 5;
?>
  <div id="OdysseyToolTip">
   <div id="OdysseyToolTipBackground"></div>
   <div id="OdysseyToolTipHeader">Tile</div>
   <div id="OdysseyToolTipItems">
<?php
for ($i = 0; $i < MAX_ITEM_INFO_DISPLAY; $i++) {
    echo "    <div class=\"OdysseyToolTipItem\">\n";
    echo "     <canvas class=\"OdysseyToolTipImage\" width=\"32\" height=\"32\"></canvas>\n";
    echo "     <div class=\"OdysseyToolTipID\">13411</div>\n";
    echo "     <div class=\"OdysseyToolTipCount\">1</div>\n";
    echo "     <div class=\"clear\"></div>\n";
    echo "    </div>\n";
}
?>
   </div>
  </div>
