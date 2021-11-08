import { Notify } from 'notiflix/build/notiflix-notify-aio';
import galleryCardsTpl from '../templates/gallery-card.hbs'
const axios = require('axios');
const API_KEY = '23825879-78d35eabdb1bf9c22a9a5e768';


const refs = {
    search: null,
    pageNumber: 1,
    form: document.querySelector('.search-form'),
    searchValue: document.querySelector('[name="searchQuery"]'),
    galleryOfImages: document.querySelector('.gallery'),
    submitButton: document.querySelector('.search-button'),
    loadMoreButton: document.querySelector('.load-more')
}
console.log(refs.galleryOfImages)
console.log(refs.searchValue)

const onSearchSubmit = (e) => {
    e.preventDefault()
    refs.search = refs.searchValue.value
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

    fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${refs.search}&image_type=photo&orientation=horizontal&safesearch=true&page=${refs.pageNumber}&per_page=40`)
        .then(response => {
            return response.json()
            
        })

        .then(images => {
            console.log(images)
            refs.galleryOfImages.innerHTML = images.hits.map(galleryCardsTpl).join('')
        })

    .catch(error => {
    console.log(error)})
}
    // getImages()



