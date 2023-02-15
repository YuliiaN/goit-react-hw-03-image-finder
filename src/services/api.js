import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '32896163-5a08927168932cddf0e5a890d';

const request = async (query, page) => {
  const params = {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 12,
    q: query,
    page,
  };
  const { data } = await axios.get('/', { params });
  const hits = data.hits.map(({ id, webformatURL, largeImageURL, tags }) => {
    return { id, webformatURL, largeImageURL, tags };
  });
  return { hits, totalHits: data.totalHits };
};

export default request;
