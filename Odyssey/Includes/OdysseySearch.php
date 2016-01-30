  <div id="OdysseySearchContainer">
   <div class="OdysseyDarkenBackground"></div>
   <div id="OdysseySearch">
    <div class="OdysseyBoxBackground"></div>
    <h2 id="OdysseySearchHeader"><a href="#">Search</a></h2>
    <fieldset>
     <label for="OdysseySearchItemID">ID: </label><input type="text" id="OdysseySearchItemID" />
     <input type="submit" id="OdysseySearchSubmit" value="Search" />
    </fieldset>
    <h2 id="OdysseySearchResults"><a href="#">Results</a></h2>
    <div id="OdysseySearchResultsContainer">
     <ul class="SearchResults">
<?php
for ($i = 0; $i < 25; $i++) {
    echo "      <li class=\"inactive\"><span class=\"search-position\">32000, 31000, 7</span> <span class=\"search-criteria\">100</span></li>\n";
}
?>
     </ul>
    </div>
   </div>
  </div>