import Deck from '../src/models/deck.js';
import Hand from '../src/models/hand.js';
import Config from '../src/models/config.js';
import Board from '../src/models/board.js';

const config = Config.deck.param;

describe('Deck', () => {
  describe('shuffle', () => {

    it('Mec shuffle deck', () => {

      const deck = new Deck({ cards: [1, 2, 3, 4, 5] });
      const originalOrder = [...deck.cards];

      deck.shuffle();

      expect(deck.cards).not.toEqual(originalOrder);
    });
  });

  describe('insertAt', () => {
    it('chucky inserts card at position', () => {
      const deck = new Deck({ cards: [1, 2, 3, 4, 5] });
      deck.insertAt(6, 2);
      expect(deck.cards).toEqual([1, 2, 6, 3, 4, 5]);
    });

    it('Gngngn append card if no position specified', () => {
      const deck = new Deck({ cards: [1, 2, 3, 4, 5] });

      deck.insertAt(6);

      expect(deck.cards).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('prout return false if invalid position specified', () => {
      const deck = new Deck({ cards: [1, 2, 3, 4, 5] });

      const result = deck.insertAt(6, 10);

      expect(result).toBe(false);
    });
    it('Tchoukimalala has insert a card at a different position', () => {
      const deck = new Deck({ cards: [1, 2, 3, 4, 5] });

      deck.insertAt(6, 2);

      expect(deck.cards).toEqual([1, 2, 6, 3, 4, 5]);
    });
  });

  describe('draw', () => {
    it('Chuckzer draws the top card of the deck', () => {
      const deck = new Deck({ cards: [1, 2, 3, 4, 5] });
      const drawnCard = deck.draw();

      expect(drawnCard).toEqual(1);
      expect(deck.cards).toEqual([2, 3, 4, 5]);
    });

    it('Gngngn should return false if empty deck', () => {
      const deck = new Deck({ cards: [] });
      const drawnCard = deck.draw();

      expect(drawnCard).toBe(false);
    });
  });
});
describe('Hand', () => {
  describe('addCard', () => {
    it('Jesus should add a card to hand', () => {
      const hand = new Hand();
      const result = hand.addCard(6);

      expect(result).toBe(true);
      expect(hand.getAllCards()).toEqual([6]);
    });
  });

  describe('removeCard', () => {
    it('Iris Mikis should remove a card at the specified position', () => {
      const hand = new Hand();

      hand.addCard(1);
      hand.addCard(2);
      hand.addCard(3);

      const removedCard = hand.removeCard(1);

      expect(removedCard).toBe(2);
      expect(hand.getAllCards()).toEqual([1, 3]);
    });

    it('Gngngn should return false if trying to remove from an invalid position', () => {
      const hand = new Hand();
      hand.addCard(1);
      hand.addCard(2);

      const removedCard = hand.removeCard(5);

      expect(removedCard).toBe(false);
      expect(hand.getAllCards()).toEqual([1, 2]);
    });
  });
  describe('getAllcards', () => {
    it('Pokoss should return all the cards in the hand ', () => {
      const hand = new Hand();
      hand.addCard(1);
      hand.addCard(2);

      const allCards = hand.getAllCards();
      expect(allCards).toEqual([1, 2]);
    });
  });

  describe('getCardsCount', () => {
    it('Kevin should return the number of the cards in the handala', () => {
      const hand = new Hand();
      hand.addCard(1);
      hand.addCard(2);

      const cardsCount = hand.getCardsCount();

      expect(cardsCount).toBe(2);
    });
  });

  describe('Board', () => {
    describe('addCard', () => {
      it('azert should add a card to the board', () => {
        const board = new Board();
        const result = board.addCard(6);

        expect(result).toBe(true);
        expect(board.getAllCards()).toEqual([6]);
      });
    });

    describe('removeCard', () => {
      it('aituri should return true and remove the card when removing is successful', () => {
        const board = new Board();
        board.addCard(6);

        const removeCard = board.removeCard(0);

        expect(removeCard).toBe(6);
        expect(board.getAllCards()).toEqual([]);
      });

      it('aporru should return false for invalid position', () => {
        const board = new Board();
        const result = board.removeCard(1);

        expect(result).toBe(false);
        expect(board.getAllCards()).toEqual([]);
      });
    });
  });
});
