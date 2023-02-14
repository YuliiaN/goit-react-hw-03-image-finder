import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Triangle } from 'react-loader-spinner';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import request from 'services/api';

export default class App extends Component {
  state = {
    query: '',
    page: 1,
    loading: false,
    error: '',
    images: [],
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    try {
      // маркер обновления состояния

      if (prevState.query !== query || prevState.page !== page) {
        this.setState({ loading: true });
        const { hits, totalHits } = await request(query, page);

        // ошибка, если запрос ничего не возвращает

        if (!hits.length) {
          toast.error(`We didn't find any ${query} images`, {
            theme: 'colored',
          });
          return;
        }

        // если все ок

        toast.success(`We have found ${totalHits} images`, {
          theme: 'colored',
        });
        this.setState(prevState => ({
          images: [...prevState.images, ...hits],
          error: '',
        }));
      }
    } catch (error) {
      toast.error('Something went wrong', {
        theme: 'colored',
      });
    } finally {
      this.setState({ loading: false });
    }
  }

  // обработка клика по кнопке load more

  handleClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  // получаем из формы имя запроса и добавляем в state

  getQuery = query => {
    this.setState({
      query,
      page: 1,
      images: [],
    });
  };

  render() {
    const { images, loading } = this.state;
    return (
      <div className="App">
        <Searchbar onSubmit={this.getQuery} />
        {images.length ? (
          <>
            <ImageGallery images={images}></ImageGallery>
            <Button onClick={this.handleClick} />
          </>
        ) : null}
        <ToastContainer autoClose={3000} />
        <Triangle
          height="100"
          width="100"
          color="#3f51b5"
          ariaLabel="triangle-loading"
          visible={loading}
          wrapperStyle={{ margin: '0 auto' }}
        />
      </div>
    );
  }
}
