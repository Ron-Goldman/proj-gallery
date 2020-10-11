'use strict';


function onInit() {
    _createBooks()
    renderBooks()
}

function onSearchBook() {
    var book = document.querySelector('.autocomplete input[name=books]').value
    showBook(book)
    book.value = ''
}

function onRemove(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook() {
    var name = document.querySelector('.add-book input[name=book-name]').value
    var price = document.querySelector('.add-book input[name=price]').value
    var quantity = document.querySelector('.add-book input[name=quantity]').value
    addBook(name, price, quantity)
    name = ''
    price = ''
    quantity = ''
    renderBooks()
}

function onAddQnty(book) {
    addQnty(book)
    renderBooks()
}

function onSubQnty(book) {
    subQnty(book)
    renderBooks()
}

function onUpdatePrice(bookId){
    updatePrice(bookId)
    renderBooks()
}

function onCloseModal(){
    closeModal()
    renderBooks()
}

function onOpenModal(bookId){
    
    openModal()
    renderBooks()
}

