import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/craeteMarkup';
import { refs } from './js/refs';
import { spinnerPlay, spinnerStop } from './js/spinner';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new PixabayAPI();

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
  evt.preventDefault();

  const searchImg = evt.target.elements.searchQuery.value.trim().toLowerCase();

  if (!searchImg) {
    clearPage();
    Notify.failure('Please enter a search value');
    return;
  }

  pixabay.searchValue = searchImg;
  clearPage();

  try {
    spinnerPlay();
    const { hits: images, totalHits } = await pixabay.getImages();

    pixabay.calculateTotalPages(totalHits);

    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);

    const markup = [...images].map(createMarkup).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    if (pixabay.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }

    lightbox.refresh();

    skrollPage();
  } catch (error) {
    console.log(error.message);
    resetMarkup();
  } finally {
    spinnerStop();
  }
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onLoadMoreBtn() {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  try {
    spinnerPlay();
    const data = await pixabay.getImages();
    const { hits: images, totalHits } = data;
    const markup = [...images].map(createMarkup).join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    lightbox.refresh();

    skrollPage();
  } catch (error) {
    console.log(error.message);
    clearPage();
  } finally {
    spinnerStop();
  }
}

function clearPage() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

const lightbox = new SimpleLightbox('.gallery a');

function skrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
