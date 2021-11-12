import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import galleryCardsTpl from '../templates/gallery-card.hbs'
import { addBackToTop } from 'vanilla-back-to-top'

addBackToTop({
    backgroundColor: '#e6c1e9',
    showWhenScrollTopIs: 500,
    scrollDuration: 1000,
    textColor: '#000',
    zIndex: 1
})

const API_KEY = '23825879-78d35eabdb1bf9c22a9a5e768';
const imagesPerPage = 40


const refs = {
    search: null,
    pageNumber: null,
    totalHits: null,
    totalQuantityOfImages: 0,
    form: document.querySelector('.search-form'),
    searchValue: document.querySelector('[name="searchQuery"]'),
    galleryOfImages: document.querySelector('.gallery'),
    submitButton: document.querySelector('.search-button'),
    loadMoreButton: document.querySelector('.load-more'),
}



const onSearchSubmit = (e) => {
    e.preventDefault()
    refs.galleryOfImages.innerHTML = ''
    refs.pageNumber = 1
    refs.totalQuantityOfImages = 0
    refs.search = refs.searchValue.value
    console.log(refs.search)
    getImages()
}

const onLoadMoreImages = () => {
    refs.pageNumber += 1
    getImages();
    
    
}
const windowScrollByTwoCards = () => {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight * 2.5,
  behavior: "smooth",
});
}

refs.form.addEventListener('submit', onSearchSubmit)
refs.loadMoreButton.addEventListener('click', onLoadMoreImages)



async function getImages() {
    try {
        Loading.dots();
        const response = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${refs.search}&image_type=photo&orientation=horizontal&safesearch=true&page=${refs.pageNumber}&per_page=${imagesPerPage}`)
        const images = await response.json()
       
        if (refs.totalQuantityOfImages > images.totalHits) {
            Notify.failure("We're sorry, but you've reached the end of search results.")
            refs.loadMoreButton.classList.add('is-hidden')
            Loading.remove()
            return;
        }
                
        if (images.hits.length === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            refs.loadMoreButton.classList.add('is-hidden')
            Loading.remove()
            return
        }
        refs.totalHits = images.totalHits
        if (refs.pageNumber === 1) {
            Notify.success(`Hooray! We found ${refs.totalHits} images.`);
            
        }
      
        
        
        const markup = images.hits.map(galleryCardsTpl).join('')
        refs.galleryOfImages.insertAdjacentHTML('beforeend', markup)
        lightbox.refresh();
        refs.loadMoreButton.classList.remove('is-hidden')
        refs.totalQuantityOfImages += imagesPerPage
        
        if (refs.pageNumber > 1) {
             setTimeout(windowScrollByTwoCards, 800)
        }

        Loading.remove()
        
       
    } catch (error) {
    console.log(error.message);
  }
        }

    
 const lightbox = new SimpleLightbox('.gallery a', {
   disableRightClick: true,
    scrollZoom: false,
    captionDelay: 250,
    captionsData: 'alt', 
});   
  



