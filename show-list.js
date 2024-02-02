//level 500

function showListSetup() {
  createShowMenu();
  createFilterBar();
  drawShowCard();
}

function refreshShowMenu(filterBarValue) {
  const selectShow = document.getElementById(_showDDLCtrlId);
  selectShow.innerHTML = "";

  const optionPlaceHolderEl = document.createElement("option");
  optionPlaceHolderEl.innerText = "--Please Select--";
  optionPlaceHolderEl.value = null;
  selectShow.appendChild(optionPlaceHolderEl);

  //add options to ddl(select show)
  _localShows.forEach((show) => {
    let add =
      !filterBarValue ||
      show.name.toLowerCase().includes(filterBarValue) ||
      show.genres.join("|").toLowerCase().includes(filterBarValue) ||
      show.summary.toLowerCase().includes(filterBarValue);
    if (add) {
      const showEl = document.createElement("option");
      showEl.innerText = show.name;
      showEl.value = show.id;
      selectShow.appendChild(showEl);
    }
  });
}

function createFilterBar() {
  const showListEl = document.getElementById("show-listing");

  const searchBarLabel = document.createElement("p");
  searchBarLabel.innerHTML = "Search a TV show by keyword(s):";
  //filter bar
  const filterBar = document.createElement("input");
  filterBar.id = "txtFilterBy";
  filterBar.setAttribute("type", "string");
  filterBar.addEventListener("input", function () {
    refreshShowMenu(filterBar.value);
    drawShowCard();
  });

  //filter result
  const filterResult = document.createElement("label");
  filterResult.id = "filterResult";

  showListEl.appendChild(searchBarLabel);
  showListEl.appendChild(filterBar);
  showListEl.appendChild(filterResult);
}

function clearShows() {
  document
    .querySelectorAll("#show-listing div.list-container")
    .forEach((el) => el.remove());
}

function createShowMenu() {
  const showlistingElem = document.getElementById("show-listing");

  const selectLabel = document.createElement("p");
  selectLabel.innerHTML = "Select a TV show:";

  // select/ddl (select show)
  const selectShow = document.createElement("select");
  selectShow.id = _showDDLCtrlId;
  selectShow.addEventListener("change", function () {
    refreshEpisodesDDL(selectShow.value);
    drawShowCard();
  });

  showlistingElem.appendChild(selectLabel);
  showlistingElem.appendChild(selectShow);
}

function drawShowCard() {
  clearShows();
  //get filter words
  const filterBar = document.getElementById("txtFilterBy");
  let filterBy = filterBar.value.toLowerCase();

  //parent
  const showListEl = document.getElementById("show-listing");

  //selected show
  const selectShow = document.getElementById(_showDDLCtrlId);
  let selectShowId = selectShow.value;

  //create container
  const container = document.createElement("div");
  container.className = "list-container";

  let found = 0;
  let filterBarValue = filterBar.value;
  _localShows.forEach((show) => {
    //filter bar filter
    let add =
      !filterBarValue ||
      show.name.toLowerCase().includes(filterBarValue) ||
      show.genres.join("|").toLowerCase().includes(filterBarValue) ||
      show.summary.toLowerCase().includes(filterBarValue);
    add =
      add &&
      (!selectShowId || selectShowId == "null" || selectShowId == show.id);

    if (add) {
      found++;
      container.appendChild(getShowCard(show));
    }
  });
  showListEl.appendChild(container);
  const filterResult = document.getElementById("filterResult");
  if (found > 0 && filterBy) {
    filterResult.innerText = `Displaying ${found}/${_localshows.length} shows`;
  } else {
    filterResult.innerText = "";
  }
}

function getShowCard(show) {
  if (!show) return null;
  const divRootEl = document.createElement("div");
  divRootEl.className = "show-card";
  const titleEl = document.createElement("h1");
  titleEl.className = "show-title";
  titleEl.addEventListener("click", function () {
    toggleDisplay(show.id);
  });
  divRootEl.appendChild(titleEl);

  const divEl = document.createElement("div");
  divEl.className = "show-grid-container";

  const imgEl = document.createElement("img");
  const spanEl = document.createElement("span");

  divEl.appendChild(imgEl);

  titleEl.className = "show-title";
  titleEl.innerText = show.name;
  if (show.image) imgEl.src = show.image.medium;
  divEl.innerHTML += show.summary;
  spanEl.innerHTML = `Rated: ${
    show.rating.average
  } <br> Genres: ${show.genres.join("|")} <br>Status: ${
    show.status
  } <br> Runtime: ${show.runtime}`;
  divEl.appendChild(spanEl);
  divRootEl.appendChild(divEl);
  return divRootEl;
}
