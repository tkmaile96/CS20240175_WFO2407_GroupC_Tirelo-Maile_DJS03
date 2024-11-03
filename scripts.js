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
    const start = currentPage  * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    displayBookPreviews(filteredBooks.slice(start, end));
    currentPage++;
    updateShowMoreButton();

}
/**
 * Initializes event listeners for various UI elements.
 */
function initializeEventListeners() {
    document.querySelector('[data-search-form]').addEventListener('submit', handleSearchForBook);
    document.querySelector('[data-list-button]').addEventListener('click', loadMoreBooks);
    document.querySelector('[data-settings-form]').addEventListener('submit', event => {
        event.preventDefault();
        const theme = new FormData(event.target).get('theme');
        applyTheme(theme);
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
    });

    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
    });

    document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    });

    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
    });

    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false;
    });

    document.querySelector('[data-list-items]').addEventListener('click', displayBookDetails);
}

