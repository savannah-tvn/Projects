export default class Deck {
    
    
    constructor(config) {
        this.cards = config.cards || [];
    }

    shuffle() {
        if (this.cards.length < 2) {
            return false;
        }
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return true;
    }

    insertAt(card, position) {
        if (position === undefined) {
            this.cards.push(card);
        } else if (position >= 0 && position <= this.cards.length) {
            this.cards.splice(position, 0, card);
        } else {
            return false;
        }
        return true;
    }

    draw() {
        if (this.cards.length > 0) {
            return this.cards.shift();
        }
        return false;
    }

    getCardsCount() {
        return this.cards.length;
    }
}
