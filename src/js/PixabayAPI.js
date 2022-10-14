import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const KEY_API = '30566454-f43afb5ebde56ee41a44e0f8d';

export class PixabayAPI {
  #page = 1;
  #searchValue = '';
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };

  async getImages() {
    const { data } = await axios.get(
      `/?key=${KEY_API}&q=${this.#searchValue}&page=${this.#page}`,
      this.#params
    );

    return data;
  }

  set searchValue(newSearchValue) {
    this.#searchValue = newSearchValue;
  }

  get searchValue() {
    return this.#searchValue;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
