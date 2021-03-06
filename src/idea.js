class Idea {
    constructor(title, body, id = Date.now(), star = false, comments = []) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.star = star;
        this.comments = comments;
    }

    toggleStar() {
        this.star = !this.star;
    }

    saveToStorage() {
      var stringifiedIdea = JSON.stringify(this);
      var storedIdea = localStorage.setItem(`${this.id}`, stringifiedIdea);
    }

    deleteFromStorage() {
      localStorage.removeItem(`${this.id}`);
    }

    updateLocallyStoredIdea() {
        this.deleteFromStorage();
        this.saveToStorage();
    }
};
