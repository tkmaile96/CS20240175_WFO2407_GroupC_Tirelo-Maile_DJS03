// import important data
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let currentPage = 1;
let filteredBooks = books

/**
 * Initialize the book preview, genre and author
 */
function InitializeUserInterface() {
    displayBookPreviews(filteredBooks.slice(0, BOOKS_PER_PAGE));
    initializeDropdown('data-search-genres', genres, 'All Genres');
    initializeDropdown('data-search-authors',  authors, 'All Authors');
    setTheme();
    updateShowMoreButton();

}

/**
 * Let us create  a function to display the book previews
 * @parameters {Array} booksToShow - List of all the books to display

 */
function displayBookPreviews(booksToShow) {
    const fragment = document.createDocumentFragment();
    booksToShow.forEach(({ author, id , image , title }) => {
        const previewButton = createBookPreviewButton({ author, id, image, title});
        fragment.appendChild(previewButton);
    })
    document.querySelector('[data-list-items]').appendChild(fragment)
}

/**
 * let us create a button  for each book preview
 * @parameters  {Object} book - Object containing the book details
 * @return  {HTMLElement} - The button created for the book preview
 */
function createBookPreviewButton({ author,  id, image, title }) {
    const  previewButton = document.createElement('button');
    previewButton.classList.add('preview');
    previewButton.dataset.id = id;
    previewButton.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
    </div>`;
    return previewButton;
}

/**
 * initiate a dropdown menu with availabe options
 * @parameters {string} dropdownDataAtrribute - the data attribute
 * @parameters  {object} options - the options to display in the dropdown
 * @parameters {string}  defaultText - the default text to display
 */
function  initializeDropdown(dropdownDataAtrribute, options, defaultText) {
    const  dropdown = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = 'any';
    defaultOption.innerText = defaultText;
    dropdown.appendChild(defaultOption);

    Object.entries(options).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        dropdown.appendChild(option);
    });
    document.querySelector(`[${dropdownDataAtrribute}]`).appendChild(dropdown);
}

/**
 * set theme based on preference
 */
function setTheme() {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    applyTheme(theme);
}

/**
 * let us apply the selected theme
 * @parameters   {string} theme - the theme to apply
 */
function applyTheme(theme) {
    document.querySelector('[data-settings-theme]').value = theme;
    const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
    const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
    document.documentElement.style.setProperty('--color-dark', darkColor);
    document.documentElement.style.setProperty('--color-light', lightColor);
}

/**
 * update the show more button
 */
function updateShowMoreButton() {
    const showMoreButton = document.querySelector('[data-list-button]');
    showMoreButton.disabled = filteredBooks.length  <= currentPage * BOOKS_PER_PAGE;
    showMoreButton.innerHTML= `
    <span>Show more</span>
        <span class="list__remaining"> (${Math.max(0, filteredBooks.length - currentPage * BOOKS_PER_PAGE)})</span>
        `;
}
/**
 * Handles form submission for the search filters.
 * Filters books and updates the display based on selected criteria.
 * @parameters {Event} event - The form submit event.
 */
function handleSearchForBook(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    filteredBooks = books.filter(book => filterBook(book, filters));
    currentPage = 1;

    document.querySelector('[data-list-items]').innerHTML = '';
    displayBookPreviews(filteredBooks.slice(0, BOOKS_PER_PAGE));
    updateShowMoreButton();
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', filteredBooks.length === 0);
    document.querySelector('[data-search-overlay]').open = false;
}

/**
 * filter books based on search
 * @parameters {object} book - the book to filter
 * @parameters  {object} filters - the search filters
 * @parameters {boolean} - true is book matches  the filter, false otherwise
 */
function  filterBook(book, filters) {
    const titleMatch = filters.title.trim() === '' ||  book.title.toLowerCase().includes(filters.title.trim().toLowerCase());
    const authorMatch = filters.author.trim() === '' || book.author === filters.author;
    const genreMatch = filters.genre === 'any'  || book.genre.includes(filters.genre);

    return  titleMatch && authorMatch && genreMatch;
}

/**
 * load additional books
 */
function loadMoreBooks() {
    const 
}


document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})