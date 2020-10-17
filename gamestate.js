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
    constructor(playerCount) {
        this.deckCount = 1;
        this.playerCount = playerCount
        this.cards = this.SetupCards() 
        this.startingCards = 7
    }

    Start() {
        let playerCards = []
        for (let i = 0; i < this.playerCount; i++) {
            playerCards.push(this.cards.splice(0, this.startingCards))
        }
        this.playerCards = playerCards
    }

    SetupCards() {
        let arr = []

        for (let d = 0; d < this.deckCount; d++) {
            for (let i = 0; i < 4; i++) {
                for (let j = 1; j < 14; j++) {
                    arr.push(new Card(j, i))
                }
            }
    
            arr.push(new Card(1, 4), new Card(1, 4))
        }
        arr = this.ShuffleCards(arr)
        return arr
    }

    ShuffleCards(arr) {
        let length = arr.length;
        let ret = [];

        for (let i = 0; i < length; i++) {
            let r = Math.round(Math.floor(Math.random() * (arr.length)));
            ret.push(arr.splice(r, 1)[0])
        }

        return ret;
    }
}

module.exports = (Game)