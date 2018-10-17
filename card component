//The template for our 'deck library', and we want to make multiple instances of the deck.  We are going to create a class. The constructor is called when you initiate the class. We can pass down info that is specific to our instance.//

module.exports = class Deck {
    constructor ( ) {
        this.deck = [ ]
        this.dealt_cards = [ ]
    }

//We are creating a deck that is an array and later we will push our deck objects to the array. This will keep our deck for us and it will enable us to push cards back into the deck later. This will keep track of what the dealt cards were, so we are creating another array to keep track of what cards were already dealt.//

//When we create our deck class, we don't necessarily want it to immediately generate our deck, because we want the ability to put some variation to that later. After we generate our deck class, we are going to call the generate function to push all of our cards to this array.
We are going to generate 3 diff. parts to our deck value; name, suit, value. We want to be able to print out the name of a card because if we want to display what the card is, we don't just want the value and the suit, we want a string to print out the name of the card.//

    generate_deck ( ) {
        let card = (suit, value) => {
            this.name = value + 'of' + suit

//We can now access our card's name and we can access that via this.name. So if we want to print out what cards are in the array or what cards are in some player's hand, we can access that easily through this.name or card.name. Whatever value we pass to suit or value are going to be assigned to this.suite or this.value. We want our card object to be returned.//

            this.suit = suit
            this.value = value
            return {name: this.name, suit: this.suit, value: this.value
            }

//When we call this card function it is going to take in the suit and the value and it goes ahead and creates these variables and it returns these variables in the form of an object so that when we are later using that card we can reference its values, its name, its suit, via its objects properties.//

            let values = ['1',  '2',  '3', '4', '5', '6', .......'Q', 'K', 'A']
            let suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts']

//We can now loop over our suits and say for each of  these suits, create a card object with this suit and each value iterating over the values array and push each card value to our deck.//

            for (let s = 0; s < suits.length; s++) {
                for (let v = 0; v < values.length; v++) {
//We want to create the card object and that will push the newest card to the end of the array. This will push the return value of our card function to our deck  and in this case the return value of our card function is an object which is going to b e our card object with a suit, value, and name.  this will be the function that generates our deck of cards.//
                    this.deck.push(cards( suit[s], values[v]))
                }
            }

//When we call this function to generate our deck in the terminal to see the deck generated if we want.//

            print_deck ( ) {
                if (this.deck.length == 0) {
                    console.log('The deck has not been generated')

//We created the print_deck function to see all the cards that are in our deck.//

                } else {
                    for (let c = 0; c < this.deck.length; c++) {
                        console.log(this.deck [c]) }

//For every card in our deck, we want to print that to our console. deck.print.deck//
                    }
                }
//Create a function that will shuffle our deck, no parameters, and it will generate a random card that is still within our deck. let current_index = this.deck.length, temporary value, and random index. These are going to be our values that are going to be represented by this current index value for now, later in our loop we are going to use that to move these around here and switch these values around in order to recursively replace cards with another card at a random index which is equivalent to shuffling our deck.//

            shuffle ( ) {
                let current_ind = this.deck.length, temp_val, rand_ind

                while (0 != current_ind) {
                    rand_ind = Math.floor (Math.random() * current_ind)

//This is going to create a random index which establish a new location for our card to be shuffled to. This will subtract 1 from our current index which will say, while there are still cards in our deck, keep doing this.//

                    current_ind -= 1
                    temp_val = this.deck [current_ind]
                    this.deck [current_ind] = this.deck [rand_ind]
                    this.deck [rand_ind] = temp_val
                }
            }

//This will replace our card. And will shuffle up all the original cards that we put into our deck.//

            deal ( ) {
                let dealt_card = this.deck.shift( )
                this.dealt_cards.push(dealt_card)
                return dealt_card
            }

//This function will remove the top card from our deck, it is assigning the value to our dealt card, it is adding the dealt card to our dealt cards array, and it is returning the dealt card so we can view it.   console.log(deck.deal) we can see our dealt out top card to ourselves. We can deal out cards to a person's hand using this function, and do later manipulations down the road.//

            replace ( ) {
                this.deck.unshift(this.dealt_cards.shift ( ))
            }

//This is going to remove the most recently dealt card  to our deck.//

            clear_deck ( ) {
                this.deck = [ ]
            }

//This function will reset our deck back to zero, an empty array.//

deck = new Deck ( )
deck.generate_deck ( )
console.log(deck.deal( ))
        }
    }
}



    }

}
