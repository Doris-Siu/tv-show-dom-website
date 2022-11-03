//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  //search bar and result
  const searchBar = document.createElement("input");
  searchBar.id = "txtSearchBy";
  searchBar.addEventListener("input", function () {
    drawEpiCard(episodeList);
  });
  const searchResult = document.createElement("label");
  searchResult.id = "searchResult";
  searchBar.setAttribute("type", "string");

  const selectMenu = document.createElement("select");
  selectMenu.id = "selName";
  const optionPlaceHolderEl = document.createElement("option");
  optionPlaceHolderEl.innerText = "--Please Select--";
  selectMenu.appendChild(optionPlaceHolderEl);
  episodeList.forEach((episode) => {
    const optionEl = document.createElement("option");
    optionEl.innerText = `S${formatVal(episode.season)}E${formatVal(
      episode.number
    )} - ${episode.name}`;
    selectMenu.addEventListener("change", function () {
      drawEpiCard(episodeList);
    });
    selectMenu.appendChild(optionEl);
  });

  rootElem.innerHTML = `Got ${episodeList.length} episode(s). The data has (originally) come from <a href= "https://www.tvmaze.com/">TVMaze.com</a><br>`;
  rootElem.appendChild(selectMenu);
  rootElem.appendChild(searchBar);
  rootElem.appendChild(searchResult);
  drawEpiCard(episodeList);
}
function clearCards() {
  document
    .querySelectorAll("#root .grid-container")
    .forEach((el) => el.remove());
}
function drawEpiCard(episodeList) {
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
  episodeList.forEach((episode) => {
    // if (optionEl && optionEl.innerText.includes(episode.name)){
    //   container.appendChild(getEpiCard(episode));
    // }
    if (
      (selectedName == "--Please Select--" ||
        selectedName.includes(episode.name)) &&
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
    searchResult.innerText = `Displaying ${found}/${episodeList.length} episodes`;
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

window.onload = setup;
