//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const container = document.createElement("div");
  container.className = "grid-container";
  rootElem.innerHTML = `Got ${episodeList.length} episode(s). The data has (originally) come from <a href= "https://www.tvmaze.com/">TVMaze.com</a>`
  episodeList.forEach((episode) => container.appendChild(getEpiCard(episode)));

  rootElem.appendChild(container);
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
