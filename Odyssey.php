<!DOCTYPE html>
<html lang="en">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Odyssey</title>
  <!-- General libraries / polyfills. -->
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/polyfill-requestanimationframe.js"></script>
  
  <!-- Internal -->
  <script type="text/javascript" src="Odyssey/Scripts/BinaryFile.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/ResourceManagerFile.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/ResourceManagerImage.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/ResourceManagerPromise.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/ResourceManager.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseyCanvasSection.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseyMapRenderer.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Console-Sub.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Matrix.js"></script>
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
  <link rel="stylesheet" href="Odyssey/Styles/State.css">
 </head>
 <body>
  <h1 id="ContentHeader">Odyssey</h1>
  <!-- Large Odyssey Minimap -->
<?php include "Odyssey/Includes/LargeMinimap.php"; ?>
  <!-- Small Odyssey Minimap -->
  <div id="OdysseyMiniMap">
   <canvas id="OdysseyMiniMapCanvas" height="127" width="127">Your browser lacks HTML5Canvas support.</canvas>
  </div>

  <!-- Navigation Cursor -->
<?php #include "Odyssey/Includes/OdysseyNavigator.php"; ?>

  <!-- Item Info -->
<?php include "Odyssey/Includes/ItemInfo.php"; ?>
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

  </div>

  <script type="text/javascript" src="Odyssey/Scripts/Dat.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/MapItem.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/MapFileParserResult.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/MapFileParser.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/MapFile.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseyMapRenderer.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseyMiniMapRenderer.js"></script>

  <script type="text/javascript" src="Odyssey/Scripts/Odyssey.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Tooltip.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseySearch.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/ToolRow.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Search.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/LinkScript.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseyNavigationList.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/OdysseyWorldMap.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controls.js"></script>
 </body>
</html>