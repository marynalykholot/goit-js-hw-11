import axios from 'axios';
import Notiflix from 'notiflix';
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";
// ....................DOM.............
const form = document.getElementById('search-form');
const searchField = form.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;

// ..................слухач........................
form.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreClick);

// ...................
async function handleFormSubmit(event) {
  event.preventDefault();
  const searchQuery = searchField.value.trim();
  page = 1;
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';

  if (!searchQuery || searchQuery.length === 0) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  try {
    await fetchImages(searchQuery, page);
  } catch (error) {
    console.error(error);
  }
}

async function handleLoadMoreClick() {
  page += 1;
  try {
    await fetchImages(searchField.value, page);
  } catch (error) {
    console.error(error);
  }
}
// ............запит..................
async function fetchImages(query, pageNumber) {
  const BASE_URL = 'https://pixabay.com/api';
  const apiKey = '40871804-d6fd0d6b4c5d1edaeeca08756';
  const perPage = 40;

  const apiUrl = `${BASE_URL}/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.hits.length > 0) {
      const markup = data.hits.map(createImageCard).join('');
      gallery.insertAdjacentHTML('beforeend', markup);
      loadMoreButton.style.display = 'block';

      if (data.totalHits && data.totalHits <= pageNumber * perPage) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
      }
    } else {
      loadMoreButton.style.display = 'none ';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
  }
}

function createImageCard(image) {
  return `
    <div class="photo-card" class="gallery">
    
      <img src=  "${image.webformatURL}" alt="${image.tags}" loading="lazy"  />
     
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>

    </div>
    
    `;
}
