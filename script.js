let _localEpisodes = [];
let _localShows = [];
let _showDDLCtrlId = "selShow";
let _epDDLCtrlId = "selName";
function sortByName(arr) {
  return arr.sort(function (a, b) {
    var textA = a.name.toLowerCase();
    var textB = b.name.toLowerCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
}
async function getAllShowAsync() {
  if (_localShows.length == 0) {
    _localShows = sortByName(getAllShows());
  }
  return true;
}
async function getAllEpisodesAsync(showId) {
  if (!showId && _localShows.length == 0) {
    console.error("Cannot get shows");
  }
  let currentShowId = showId ?? _localShows[0].id;
  let localShowsEpisodes = {};
  //use local storage to avoid api load
  let localShowsEpisodesJsonStr = localStorage.getItem("localShowsEpisodes");
  //localStorage has localShowsEpisodes Item and the item has currentshowId key
  if (localShowsEpisodesJsonStr) {
    localShowsEpisodes = JSON.parse(localShowsEpisodesJsonStr);
    if (localShowsEpisodes[currentShowId]) {
      //setup Episodes
      _localEpisodes = localShowsEpisodes[currentShowId];
      return true;
    }
  }
  //if localStorage items have no key equals to currentShowId, call api
  const response = await fetch(
    "https://api.tvmaze.com/shows/" + currentShowId + "/episodes"
  );
  //save the result to localStorage
  localShowsEpisodes[currentShowId] = await response.json();
  localStorage.setItem(
    "localShowsEpisodes",
    JSON.stringify(localShowsEpisodes)
  );
  //setup Episodes
  _localEpisodes = localShowsEpisodes[currentShowId];
  return true;
}
//You can edit ALL of the code here
async function setup() {
  createSearchResult();
  createShowMenu();
  createEPMenu();
  createSearchBar();
  let allshowsResult = await getAllShowAsync();
  if (allshowsResult) {
    let allEpisodesResult = await refreshEpisodesDDL();
    refreshShowMenu();
    if (allEpisodesResult) {
      drawEpiCard();
    }
  }
}
async function refreshEpisodesDDL(showId) {
  await getAllEpisodesAsync(showId);
  const selectMenu = document.getElementById(_epDDLCtrlId);
  selectMenu.innerHTML = "";

  const optionPlaceHolderEl = document.createElement("option");
  optionPlaceHolderEl.innerText = "--Please Select--";
  selectMenu.appendChild(optionPlaceHolderEl);

  _localEpisodes.forEach((episode) => {
    const optionEl = document.createElement("option");
    optionEl.innerText = `S${formatVal(episode.season)}E${formatVal(
      episode.number
    )} - ${episode.name}`;

    selectMenu.appendChild(optionEl);
  });
  drawEpiCard();
}
function refreshShowMenu() {
  const selectShow = document.getElementById(_showDDLCtrlId);
  selectShow.innerHTML = "";
  //add options to ddl(select show)
  _localShows.forEach((show) => {
    const showEl = document.createElement("option");
    showEl.innerText = show.name;
    showEl.value = show.id;
    selectShow.appendChild(showEl);
  });
}
function createSearchResult() {
  const rootElem = document.getElementById("root");
  const resultP = document.createElement("p");
  resultP.innerHTML = `Got ${_localEpisodes.length} episode(s). The data has (originally) come from <a href= "https://www.tvmaze.com/">TVMaze.com</a><br>`;
  rootElem.appendChild(resultP);
}
function createShowMenu() {
  const rootElem = document.getElementById("root");

  // select/ddl (select show)
  const selectShow = document.createElement("select");
  selectShow.id = _showDDLCtrlId;
  selectShow.addEventListener("change", function () {
    refreshEpisodesDDL(selectShow.value);
  });

  rootElem.appendChild(selectShow);
}
function createEPMenu() {
  const rootElem = document.getElementById("root");
  const selectMenu = document.createElement("select");
  selectMenu.id = _epDDLCtrlId;
  selectMenu.addEventListener("change", function () {
    drawEpiCard();
  });
  rootElem.appendChild(selectMenu);
}
function createSearchBar() {
  const rootElem = document.getElementById("root");

  //search bar
  const searchBar = document.createElement("input");
  searchBar.id = "txtSearchBy";
  searchBar.setAttribute("type", "string");
  searchBar.addEventListener("input", function () {
    drawEpiCard();
  });

  //search result
  const searchResult = document.createElement("label");
  searchResult.id = "searchResult";

  // const resultP = document.createElement("p");
  // resultP.innerHTML = `Got ${_localEpisodes.length} episode(s). The data has (originally) come from <a href= "https://www.tvmaze.com/">TVMaze.com</a><br>`;
  // //rootElem.innerHTML = `Got ${_localEpisodes.length} episode(s). The data has (originally) come from <a href= "https://www.tvmaze.com/">TVMaze.com</a><br>`;

  // rootElem.insertBefore(resultP, rootElem.firstChild);
  rootElem.appendChild(searchBar);
  rootElem.appendChild(searchResult);
  //drawEpiCard();
}
function clearCards() {
  document
    .querySelectorAll("#root div.grid-container")
    .forEach((el) => el.remove());
}
function drawEpiCard() {
  clearCards();
  //get search words
  const searchBar = document.getElementById("txtSearchBy");
  let searchBy = searchBar.value.toLowerCase();

  //root
  const rootElem = document.getElementById("root");

  //selected option
  const selectMenu = document.getElementById("selName");
  let selectedName = selectMenu.value;

  //create container
  const container = document.createElement("div");
  container.className = "grid-container";

  let found = 0;
  _localEpisodes.forEach((episode) => {
    if (
      //ddl filter
      (selectedName === "--Please Select--" ||
        selectedName.includes(episode.name)) &&
      //search bar filter
      (!searchBy ||
        episode.summary.toLowerCase().includes(searchBy) ||
        episode.name.toLowerCase().includes(searchBy))
    ) {
      found++;
      container.appendChild(getEpiCard(episode));
    }
  });
  rootElem.appendChild(container);
  const searchResult = document.getElementById("searchResult");
  if (found > 0 && searchBy) {
    searchResult.innerText = `Displaying ${found}/${_localEpisodes.length} episodes`;
  } else {
    searchResult.innerText = "";
  }
}
function formatVal(val) {
  return val.toString().padStart(2, "0");
}
function getEpiCard(episode) {
  const divEl = document.createElement("div");
  const titleEl = document.createElement("h1");
  const imgEl = document.createElement("img");
  divEl.appendChild(titleEl);
  divEl.appendChild(imgEl);
  divEl.className = "card ";
  imgEl.className = "image";
  titleEl.className = "title";
  titleEl.innerText = `${episode.name} - S${formatVal(
    episode.season
  )}E${formatVal(episode.number)}`;
  imgEl.src = episode.image.medium;
  divEl.innerHTML += episode.summary;
  return divEl;
}

window.onload = setup();
