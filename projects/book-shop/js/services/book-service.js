'use strict';

const STORAGE_KEY = 'booksDB';
var gBooks;
var gBookNames = ['1984', 'Antigone', 'Catch 22', 'Charlottes Web', 'Crime And Punishment', 'Dracula', 'Gone With The Wind', 'Lord Of The Rings', 'Moby Dick', 'The Castle', 'The Great Gatsby', 'The Handmaids Tale', 'The Odyssey', 'The Possessed', 'War And Peace']

function renderBooks() {
    var books = gBooks
    var strHtml = `<tr class="catagories">
                        <td>Cover</td>    
                        <td>ID <button onclick="onSort(this)">sort</button></td>
                        <td>Title <button onclick="onSort(this)">sort</button></td>
                        <td>Price <button onclick="onSort(this)">sort</button></td>
                        <td>actions</td>
                        <div class="modal">
                            <button onclick="closeModal()">X</button>
                            <h1>Movie<h1/>
                        </div>
                    </tr>`
    var strHtmls = books.map(function (book) {
        return `<tr >
                    <td class="cell">${book.imgUrl}</td>
                    <td class="cell">${book.id}</td>
                    <td class="cell">${book.name}</td>
                    <td class="cell price" onclick="updatePrice('${book.id}')">${book.price} $</td>
                    <td class="cell">
                        <table class="actions">
                            <td><button onclick="onOpenModal('${book.id}')">Read</button></td>
                            <td>
                                <table >
                                    <td><button onclick="onSubQnty('${book.id}')">-</button></td>
                                    <td><span>${book.quantity}</span></td>
                                    <td><button onclick="onAddQnty('${book.id}')">+</button></td>
                                </table>
                            </td>
                            
                            <td> <button onclick="onRemove('${book.id}')">Delete</button></td>
                        </table>
                    </td>
                 </tr>`
    })

    document.querySelector('.books-box').innerHTML = strHtml + strHtmls.join('')
}


function _createBook(name) {
    return {
        id: makeId(),
        name,
        price: getRandomIntInclusive(5, 25),
        imgUrl: `<img src="img/${convertStrToKebab(name)}.jpg" alt="${name}"></img>`,
        quantity: 10
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < gBookNames.length; i++) {
            var name = gBookNames[i]
            books.push(_createBook(name))
        }
    }
    gBooks = books;
    console.log(gBooks);
    _saveBooksToStorage();
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id
    })
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage();
}

function addBook(name, price, quantity) {
    var newBook = _createBook(name)
    newBook.price = price;
    newBook.quantity = quantity;
    newBook.imgUrl = `<img src="img/cover-na.png" alt="Cover N/A"></img>`
    gBooks.unshift(newBook);
    _saveBooksToStorage()
}

function addQnty(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id
    })
    gBooks[bookIdx].quantity++
    _saveBooksToStorage()
}

function subQnty(bookId) {
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id
    })  
    gBooks[bookIdx].quantity--
    _saveBooksToStorage()
}

function updatePrice(bookId){
    var book = findBookIdxById(bookId)
    var price = +prompt('set a new price')
    console.log(price);
    gBooks[book].price = price 
    _saveBooksToStorage()
}

function findBookIdxById(bookId){   
    var bookIdx = gBooks.findIndex(function (book) {
        return bookId === book.id
    })
    return bookIdx
}

function closeModal(){
    document.querySelector('.modal').style.display = 'none'
}

function openModal(bookId){
    document.querySelector('.modal').style.display = 'flex'
    
    var bookIdx = findBookIdxById(bookId)
    var book = gBooks[bookIdx]
    

    document.querySelector('.modal h1').innerText = book.name
}

autocomplete(document.getElementById("myInput"), gBookNames);

