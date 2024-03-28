import Hand from './hand';

export default class Board extends Hand {
    constructor(limit = 7) {
        super(limit);
    }
}