class Card {
    //Card type
    //Value: 1-13, ace is 1
    //Suit: 0-3, hearts, diamonds, clubs, spades
    constructor(value, suit) {
        this.value = value
        this.suit = suit
        switch(suit){
            case 0:
                this.suitString = "heart"
                break;
            case 1:
                this.suitString = "diamond"
                break;
            case 2:
                this.suitString = "club"
                break;
            case 3:
                this.suitString = "spade"
                break;
        }
    }

    toString() {
        return `${this.value} of ${this.suitString}s`
    }
}

class Game {
    constructor() {
        this.deckCount = 1;
        this.cards = this.SetupCards() 
    }

    SetupCards() {
        let arr = []

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 14; j++) {
                arr.push(new Card(j, i))
            }
        }

        return arr
    }
}

module.exports = (Game)