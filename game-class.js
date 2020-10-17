class Card {
    //Card type
    //Value: 1-13, ace is 1
    //Suit: 0-4, hearts, diamonds, clubs, spades, joker
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
            case 4:
                this.suitString = "joker"
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
            for (let j = 1; j < 14; j++) {
                arr.push(new Card(j, i))
            }
        }

        arr.push(new Card(1, 4), new Card(1, 4))

        return arr
    }
}

module.exports = (Game)