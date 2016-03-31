<!DOCTYPE html>
<html lang="en">
 <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" type="image/x-icon" href="Odyssey/Images/Favicon128.ico" />
  <title>Odyssey</title>
  <!-- General libraries / polyfills. -->
  <script type="text/javascript" src="Odyssey/Scripts/Generics/Helper.js"></script>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Polyfills/polyfill-requestanimationframe.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Polyfills/Console-Sub.js"></script>
    
  <!-- Events -->
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyEventDispatchInterface.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyEventHandler.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyEventDispatcher.js"></script>
  <!--<script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyZoomState.js"></script>-->
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyMapPositionChangedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyMapZoomChangedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyMapRenderCompleteEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyMapFileLoadedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyMapClickEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyMinimapRenderedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyWorldMapShowEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyWorldMapHideEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyWorldMapToggleEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseySpriteIndexLoadedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyDatLoadedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyInitializedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyBinaryFileLoadedEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyBinaryFileErrorEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyResourceManagerCompleteEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyLinkClickEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyWorldMapOpenLinkClickEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseyWorldMapCloseLinkClickEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseySearchFindEvent.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Events/OdysseySearchCompleteEvent.js"></script>
  
  
  <!-- Internal -->
  <script type="text/javascript" src="Odyssey/Scripts/Generics/ResourceManager.js"></script>
  
  <script type="text/javascript" src="Odyssey/Scripts/Model/OdysseyModelAttributor.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyViewAttributor.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyControllerAttributor.js"></script>
  
  <script type="text/javascript" src="Odyssey/Scripts/Model/OdysseyModel.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/BinaryFile.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/ResourceManagerFile.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/Matrix.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/OdysseyWorld.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/OdysseyGeography.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/OdysseyWorldSpawns.js"></script>
  
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyView.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyCanvasSection.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyTileMap.js"></script>
  
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

  <script type="text/javascript" src="Odyssey/Scripts/Model/Dat.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/MapItem.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/MapFileParserResult.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/MapFileParser.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/MapFile.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Model/OdysseyMapIndex.js"></script>
  
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyTileMap.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyMinimap.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/Zoom.js"></script>
  <!--<script type="text/javascript" src="Odyssey/Scripts/View/Tooltip.js"></script>-->
  <script type="text/javascript" src="Odyssey/Scripts/View/ToolRow.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyNavigationList.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyWorldMap.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseyTileInfo.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/View/OdysseySpriteIndex.js"></script>
  
  
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyController.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyMapSearch.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyOverlay.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyControlManager.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyWorldMapControl.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseyLinkClickControl.js"></script>
  <script type="text/javascript" src="Odyssey/Scripts/Controller/OdysseySearchControl.js"></script>
  <!--<script type="text/javascript" src="Odyssey/Scripts/Controller/Controls.js"></script>-->
  
  <script type="text/javascript" src="Odyssey/Scripts/Odyssey.js"></script>
  
  <script type="text/javascript" src="Odyssey/Scripts/Main.js"></script>
  
  <script type="text/javascript" src="Odyssey/Scripts/View/DelayLoad.js"></script>
 </body>
</html>