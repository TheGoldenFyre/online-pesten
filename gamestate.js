class Card {
    //Card type
    //Value: 1-13, ace is 1
    //Suit: 0-4, klaver, diamonds, harten, schoppen, joker
    constructor(value, suit) {
        this.value = value
        this.suit = suit
        switch(suit){
            case 0:
                this.suitString = "♣"
                break;
            case 1:
                this.suitString = "♢"
                break;
            case 2:
                this.suitString = "♡"
                break;
            case 3:
                this.suitString = "♠"
                break;
            case 4:
                this.suitString = "🃏"
        }
        this.isValidMove = false
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
        this.stack = [] 
        this.playerCards = []
        this.gameRules = this.SetupGameRules()
        this.startingCards = 7
        this.currentTurn = 1
        this.goingCW = true //1 for cw, -1 for ccw
        this.cardsToDraw = 0
    }

    Start() {
        this.cards = this.SetupCards()

        let pCards = []
        for (let i = 0; i < this.playerCount; i++) {
            pCards.push(this.cards.splice(0, this.startingCards))
        }
        this.playerCards = pCards
        this.stack = []
        this.stack.push(this.cards.splice(0,1)[0])
        this.SetValidMoves()
    }

    Move(player, index) {
        this.stack.push(this.playerCards[player].splice(index, 1)[0])
    }

    //Returns a fully shuffled deck of cards
    SetupCards() {
        let arr = []

        for (let d = 0; d < this.deckCount; d++) {
            for (let i = 0; i < 4; i++) {
                for (let j = 1; j < 14; j++) {
                    arr.push(new Card(j, i))
                }
            }
    
            arr.push(new Card(14, 4), new Card(14, 4))
        }
        arr = this.ShuffleCards(arr)
        return arr
    }

    CheckValidMove(card) {
        let b = false
        for (let i = 0; i < this.gameRules.length; i++) {
            let c = this.gameRules[i](card, this.stack[this.stack.length - 1], this.cardsToDraw)

            if (c == "valid")
                b = true;
            else if (c == "invalid-now") 
                return false
        }
        return b
    }

    //Checks the validity of the cards in a players hand
    SetValidMoves() {    
        //invalidate old moves
        for (let i = 0; i < this.playerCards.length; i++) {
            for (let j = 0; j < this.playerCards[i].length; j++) {
                this.playerCards[i][j].isValidMove = false
            }
        }
        
        for (let i = 0; i < this.playerCards[this.currentTurn - 1].length; i++) {
            this.playerCards[this.currentTurn - 1][i].isValidMove = this.CheckValidMove(this.playerCards[this.currentTurn - 1][i])
        }
    }

    //Allows the changing of which cards are allowed to be placed on which other cards 
    SetupGameRules() {
        let arr = []

        //Allows for skipping and rotating of cards
        arr.push(function (pCard, sCard, cards) {
            if (cards > 0) {
                if (sCard.value == 1 || sCard.value == 2 || sCard.value == 14) {
                    if (pCard.value == 1 || pCard.value == 2 || pCard.value == 14) {
                        return "valid";
                    } else{
                        console.log("vvbvv")
                        return "invalid-now"
                    }
                } else {
                    console.log("aaaa")
                    return "invalid-now"
                }
            }
        })

        //Matching suits
        arr.push(function (pCard, sCard) {
            if (pCard.suit == sCard.suit) { 
                return "valid";
            }
            return "invalid"
        })

        //Matching numbers
        arr.push(function (pCard, sCard) {
            if (pCard.value == sCard.value) { 
                return "valid";
            }
        })

        //Jack on everything
        arr.push(function (pCard, sCard) {
            if (pCard.value == 11) { 
                return "valid";
            }
            return "invalid"
        })

        //Joker on everything & everything on joker
        arr.push(function(pCard, sCard) {
            if (pCard.suit == 4 || sCard.suit == 4) {
                return "valid"
            }
            return "invalid"    
        })

        //2's, aces and jokers are allowed to be played on top of each other
        arr.push(function(pCard, sCard) {
            //2 on...
            if ( (pCard.value == 2 && sCard.value == 1 ) || (pCard.value == 2 && sCard.suit == 4) ) {
                return "valid"
            }
                
            //ace on...
            if ( (pCard.value == 1 && sCard.value == 2 ) || (pCard.value == 1 && sCard.suit == 4) ) {
                return "valid"
            }
                
            //joker on...
            if ( (pCard.suit == 4 && sCard.value == 2 ) || (pCard.suit == 4 && sCard.value == 1) ) {
                return "valid"
            }
                

            return "invalid"
        })

        return arr
    }

    //Handle a end-turn event by changing modifying the currentTurn
    EndTurn() {
        let cw, ccw;
        if (this.currentTurn + 1 > this.playerCount)
            cw = 1
        else 
            cw = this.currentTurn + 1
        if (this.currentTurn - 1 < 1)
            ccw = this.playerCount
        else 
            ccw = this.currentTurn - 1

        this.currentTurn = this.goingCW ? cw : ccw
    }

    //Determine next turn based on card placed
    nextTurn(card) {
        let cw, ccw;
            if (this.currentTurn + 1 > this.playerCount)
                cw = 1
            else 
                cw = this.currentTurn + 1
            if (this.currentTurn - 1 < 1)
                ccw = this.playerCount
            else 
                ccw = this.currentTurn - 1

        switch(card.value) {
            case 7:
            case 13:
                return;
            case 8:
                if(this.playerCount == 2) {
                    return
                } else {
                    if (this.goingCW) {
                        if (this.currentTurn + 1 == this.playerCount) {
                            this.currentTurn = 1
                            return
                        }
                        else if (this.currentTurn + 2 > this.playerCount) {
                            this.currentTurn = 2
                            return
                        } else {
                            this.currentTurn += 2
                            return
                        }
                    } else {
                        if (this.currentTurn == 1) {
                            this.currentTurn = this.playerCount - 1
                            return
                        } else if (this.currentTurn == 2) {
                            this.currentTurn = this.playerCount
                            return
                        } else {
                            this.currentTurn -= 2
                            return
                        }
                    }
                }
            case 1:
                this.goingCW = !this.goingCW
                if (this.playerCount == 2 && this.cardsToDraw == 0) {
                    return;
                }
                break;
            //Handles jokers and 2s
            case 2:
                this.cardsToDraw += 2;
                break;
            case 14:
                this.cardsToDraw += 5;
                break;
        }
        this.currentTurn = this.goingCW ? cw : ccw
    }

    GetCard(count, player) {
        for (let i = 0; i < count; i++) {
            if (this.cards.length == 0) {
                this.cards = this.ShuffleCards(this.stack.splice(0, this.stack.length - 2))
            }

            this.playerCards[player].push(this.cards.splice(0, 1)[0])
        }
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