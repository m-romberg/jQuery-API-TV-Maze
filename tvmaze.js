"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");
const episodesListButton = ".btn btn-outline-light btn-sm Show-getEpisodes";
const API_TV_MAZE_URL = `http://api.tvmaze.com/`;
const NO_IMAGE_URL = `https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Red_X.svg/200px-Red_X.svg.png`;
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  console.log("shows by term ran");
  const showResponse = await axios.get(`${API_TV_MAZE_URL}search/shows`, {
    params: { q: term },
  });

  console.log("i got some shows", showResponse);

  const showData = showResponse.data.map((show) => {
    return {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image ? show.show.image.medium : NO_IMAGE_URL, //NOTE: may not have image;
    };
  });

  console.log("Data for shows", showData);
  return showData;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}'s Image"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" id=${show.id}>
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

// NOTE: Make sure we can search for new show after first search
// without reloading the page

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// $showsList.on("click", episodesListButton, function (evt) {
//   console.log(evt.target.id);
// });

// async function getEpisodesOfShow(evt) {
//   console.log(evt.target.id);
// }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
