<?php
$debug_mode = isset($_REQUEST['debug']);
?>
<!DOCTYPE html>
<html lang="en">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" type="image/x-icon" href="Odyssey/Images/Favicon128.ico" />
  <title>Odyssey</title>
<?php if (!$debug_mode) { include "Odyssey/Includes/ScriptsHead.php"; } ?>
  <!-- CSS -->
  <link rel="stylesheet" href="Odyssey/Styles/Odyssey.css">
  <link rel="stylesheet" href="Odyssey/Styles/OdysseyViewport.css">
  <link rel="stylesheet" href="Odyssey/Styles/OdysseySearch.css">
  <link rel="stylesheet" href="Odyssey/Styles/ToolRow.css">
  <link rel="stylesheet" href="Odyssey/Styles/Experimental.css">
  <link rel="stylesheet" href="Odyssey/Styles/ToolTip.css">
  <link rel="stylesheet" href="Odyssey/Styles/Minimap.css">
  <link rel="stylesheet" href="Odyssey/Styles/Navigator.css">
  <link rel="stylesheet" href="Odyssey/Styles/Demonstration.css">
  <link rel="stylesheet" href="Odyssey/Styles/NavigationList.css">
  <link rel="stylesheet" href="Odyssey/Styles/OdysseyZoom.css">
  <link rel="stylesheet" href="Odyssey/Styles/State.css">
  <link rel="stylesheet" href="Odyssey/Styles/Status.css">
 </head>
 <body>
  <h1 id="ContentHeader">Odyssey</h1>
  <!-- Large Odyssey Minimap -->
<?php include "Odyssey/Includes/LargeMinimap.php"; ?>
  <!-- Small Odyssey Minimap -->
  <div id="OdysseyMinimap">
   <canvas id="OdysseyMinimapCanvas" height="127" width="127">Your browser lacks HTML5Canvas support.</canvas>
  </div>

  <!-- Navigation Cursor -->
<?php #include "Odyssey/Includes/OdysseyNavigator.php"; ?>

  <!-- Item Info -->
<?php include "Odyssey/Includes/ItemInfo.php"; ?>

  <!-- Status -->
<?php include "Odyssey/Includes/Status.php"; ?>
  <div id="OdysseyToolRow">
  
   <div id="OdysseyToolRowIcon">
    <div class="OdysseyBoxBackground"></div>
    <a id="OdysseyOpenToolRow" href="#" class="tool-link">
     <img src="Odyssey/Images/Icon-Extra.png" />
    </a>
   </div>
   
   <div id="OdysseyToolNavigation">
    <div class="OdysseyBoxBackground"></div>
    <a id="OdysseyOpenNavigation" href="#" class="tool-link">
     <img src="Odyssey/Images/Icon-Menu.png" alt="Navigation" />
     <span class="link-label">Navigation</span>
    </a>
   </div>
   
   <div id="OdysseyToolMinimap">
    <div class="OdysseyBoxBackground"></div>
    <a id="OdysseyOpenMinimap" href="#" class="tool-link">
     <img src="Odyssey/Images/Icon-Worldmap.png" alt="Worldmap" />
     <span class="link-label">Worldmap</span>
    </a>
   </div>
   
   <div id="OdysseyToolSearch">
    <div class="OdysseyBoxBackground"></div>
    <a id="OdysseyOpenSearch" href="#" class="tool-link">
     <img src="Odyssey/Images/Icon-Search.png" alt="Search" />
     <span class="link-label">Search</span>
    </a>
   </div>
   
  </div>
  
  <!-- Odyssey Navigation List -->
<?php include "Odyssey/Includes/OdysseyNavList.php"; ?>
  
  <!-- Odyssey Search -->
<?php include "Odyssey/Includes/OdysseySearch.php"; ?>

  <div id="map-container">
   <div id="map">
    <!-- Odyssey Map Viewport -->
<?php include "Odyssey/Includes/OdysseyMapViewport.php"; ?>

    <!-- Odyssey Map Grid -->
<?php include "Odyssey/Includes/MapGrid.php"; ?>
   </div>
  </div>

<?php include "Odyssey/Includes/" . (!$debug_mode ? "ScriptsFoot.php" : "ScriptsCompiled.php"); ?>

 </body>
</html>