export default class Hand {
    
    constructor (limit=7) {
        this.mCards = [];
        this.limit = limit; 
    }

    addCard(card) {
        if (this.mCards.length < this.limit) {
            this.mCards.push(card);
            return true;
        } else {
            return false;
        }
    }

    removeCard(position) {
        if (position >= 0 && position < this.mCards.length) {
            const removeCard = this.mCards.splice(position, 1);
            return removeCard[0];
        } else {
            return false;
        }
    }

    getAllCards() { 
        return this.mCards;
    }

    getCardsCount() {
        return this.mCards.length;
    }
}
