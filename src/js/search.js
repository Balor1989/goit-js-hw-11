import { Notify } from 'notiflix/build/notiflix-notify-aio';
import galleryCardsTpl from '../templates/gallery-card.hbs'
const axios = require('axios');
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
    loadMoreButton: document.querySelector('.load-more')
}


const onSearchSubmit = (e) => {
    e.preventDefault()
    refs.pageNumber = 1
    refs.totalQuantityOfImages = 0
    refs.search = refs.searchValue.value
    refs.loadMoreButton.classList.remove('is-hidden')
    console.log(refs.search)
    getImages()
    
}

const onLoadMoreImages = () => {
    refs.pageNumber += 1
    getImages()
    
}

refs.form.addEventListener('submit', onSearchSubmit)
refs.loadMoreButton.addEventListener('click',onLoadMoreImages)




function getImages() {

    fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${refs.search}&image_type=photo&orientation=horizontal&safesearch=true&page=${refs.pageNumber}&per_page=${imagesPerPage}`)
        .then(response => {
            return response.json()
            
        })

        .then(images => {
            if (refs.totalQuantityOfImages > images.totalHits) {
                Notify.failure("We're sorry, but you've reached the end of search results.")
                refs.loadMoreButton.classList.add('is-hidden')
                return;
            }
                
            if (images.hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return
            }
            refs.totalHits = images.totalHits
            if (refs.pageNumber === 1)
            {Notify.success(`Hooray! We found ${refs.totalHits} images.`);
                }

            
            console.log(refs.totalHits)
            console.log(images)
            refs.galleryOfImages.innerHTML = images.hits.map(galleryCardsTpl).join('')
            refs.totalQuantityOfImages += imagesPerPage
        })

    .catch(error => {
    console.log(error)})
}
    // getImages()



