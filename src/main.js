var saveButton = document.querySelector('#save-button');
var cardGrid = document.querySelector('.card-grid');
var titleInput = document.querySelector('.title-input');
var bodyInput = document.querySelector('.body-input');
var ideaForm = document.querySelector('.idea-form');
var makeCommentPopUp = document.querySelector('#make-comment-pop-up');
var commentInput = document.querySelector('#comment-input');
var submitCommentButton = document.querySelector('#submit-comment');
var commentForm = document.querySelector('.comment-form');
var filterIdeasButton = document.querySelector('.show-starred');
var searchInput = document.querySelector('.search-ideas-box');
var commentsDisplayGrid = document.querySelector('#comments-display')
var searchButton = document.querySelector('.search-icon');
var closeCommentsButton = document.querySelector('.close-comments-display');
var commentBox = document.querySelector('#comment-box');
var ideas = [];



//add event listeners here 🍊
saveButton.addEventListener('click', makeNewIdeaCard);
cardGrid.addEventListener('click', upDateIdea);
ideaForm.addEventListener('keyup', toggleSaveButton);
submitCommentButton.addEventListener('click', addCommentToIdea);
filterIdeasButton.addEventListener('click', filterStarredIdeas);
searchButton.addEventListener('click', searchIdeas);
searchInput.addEventListener('keyup', clearSearch);
closeCommentsButton.addEventListener('click', closeCommentsDisplay);
window.addEventListener('load', updateFromStorage);

//add functions here 🍊
function toggleSaveButton() {
    if (titleInput.value === '' || bodyInput.value === '') {
        saveButton.disabled = true;
    } else {
        saveButton.disabled = false;
    }
};


function makeNewIdeaCard() {
    var newIdea = new Idea(titleInput.value, bodyInput.value);
    ideas.push(newIdea);
    newIdea.saveToStorage();
    upDateCardGrid(ideas);
    clearFields(titleInput, bodyInput);
};

function clearFields(title, body) {
    title.value = '';
    body.value = '';
    toggleSaveButton();
};

function upDateCardGrid(array) {
    newGrid = '';
    for (var i = 0; i < array.length; i++) {
        newGrid +=
            `<section class='idea-card'>
          <div class='fav-delete-header'>
            <input type='image' id='star-${array[i].id}' class='star' src='${testForStar(array[i])}'>
            <input type='image' id='delete-card-${array[i].id}' class='delete-card' src='./assets/delete.svg'>
          </div>
          <div class='idea-content'>
            <p class='idea-title'>${array[i].title}</p>
            <p class='idea-body'>${array[i].body}</p>
          </div>
          <div class='comment-strip'>
            <input type='image' class='idea-comment' id='idea-comment-${array[i].id}' name='comment' src='./assets/comment.svg'>
            <label for='comment'>Comment</label>
            <button type='button' class='show-comments' id='show-comment-${array[i].id}'>Show Comments (${array[i].comments.length})</button>
          </div>
          </section>`;
    }
    cardGrid.innerHTML = newGrid;
};

function upDateIdea() {
    if (checkForButtonType('delete-card')) {
        deleteIdea();
    } else if (checkForButtonType('star')) {
        starIdea();
    } else if (checkForButtonType('idea-comment')) {
        openCommentForm();
    } else if (checkForButtonType('show-comment')) {
        displayComments();
    }
    upDateCardGrid(ideas);
};

function openCommentForm() {
    makeCommentPopUp.showModal();
    for (var i = 0; i < ideas.length; i++) {
        if (testForMatchAmongIdeas(`idea-comment`, i, event.target.id)) {
            commentForm.id = `form-${ideas[i].id}`;
        }
    }
};


function addCommentToIdea() {
    var newComment = new Comment(commentInput.value);
    for (var i = 0; i < ideas.length; i++) {
        console.log(testForMatchAmongIdeas(`form`, i, commentForm.id));
        if (testForMatchAmongIdeas(`form`, i, commentForm.id)) {
            ideas[i].comments.push(newComment);
            ideas[i].updateLocallyStoredIdea();
        }
    }
    makeCommentPopUp.close();
};

function checkForButtonType(iDPrefix) {
    return event.target.id.includes(iDPrefix);
};

function testForMatchAmongIdeas(targetIDPrefix, index, targetID) {
    if (`${targetIDPrefix}-${ideas[index].id}` === targetID) {
        return true
    }
};

function deleteIdea() {
    for (var i = 0; i < ideas.length; i++) {
        if (testForMatchAmongIdeas(`delete-card`, i, event.target.id)) {
            ideas[i].deleteFromStorage();
            ideas.splice(i, 1);
        }
    }
};

function starIdea() {
    for (var i = 0; i < ideas.length; i++) {
        if (testForMatchAmongIdeas(`star`, i, event.target.id)) {
            ideas[i].toggleStar();
            ideas[i].updateLocallyStoredIdea();
        }
    }
};

function testForStar(idea) {
    if (idea.star === true) {
        return './assets/star-active.svg';
    } else {
        return './assets/star.svg';
    }
};

function updateFromStorage() {
    for (var i = 0; i < localStorage.length; i++) {
        var keyName = localStorage.key(i);
        var retrievedIdea = localStorage.getItem(keyName);
        var parsedIdea = JSON.parse(retrievedIdea);
        var oldIdeaFromStorage = new Idea(parsedIdea.title, parsedIdea.body, parsedIdea.id, parsedIdea.star, parsedIdea.comments);
        ideas.push(oldIdeaFromStorage);
    }
    upDateCardGrid(ideas);
};

function filterStarredIdeas() {
    if (filterIdeasButton.innerText === 'Show All Ideas') {
        upDateCardGrid(ideas);
        filterIdeasButton.innerText = 'Show Starred Ideas';
    } else {
        var starredIdeas = [];
        for (var i = 0; i < ideas.length; i++) {
            if (ideas[i].star) {
                starredIdeas.push(ideas[i]);
            }
        }
        upDateCardGrid(starredIdeas);
        filterIdeasButton.innerText = 'Show All Ideas';
    }
};

function searchIdeas() {
    event.preventDefault();
    if (searchInput.value === '') {
        upDateCardGrid(ideas);
    } else {
        var searchedIdeas = [];
        for (var i = 0; i < ideas.length; i++) {
            if (ideas[i].body.includes(searchInput.value) || ideas[i].title.includes(searchInput.value)) {
                searchedIdeas.push(ideas[i]);

            }
        }
        upDateCardGrid(searchedIdeas);
    }
};

function clearSearch() {
    if (searchInput.value === '') {
        upDateCardGrid(ideas);
    }
};


function displayComments() {
    var commentsGrid = '';
    for (var i = 0; i < ideas.length; i++) {
        if (testForMatchAmongIdeas(`show-comment`, i, event.target.id)) {
            for (var g = 0; g < ideas[i].comments.length; g++) {
                commentsGrid += `<p>${ideas[i].comments[g].content}</p>`;
            }
        }
    }
    commentBox.innerHTML = commentsGrid;
    commentsDisplayGrid.showModal();
};

function closeCommentsDisplay() {
    commentsDisplayGrid.close();
};