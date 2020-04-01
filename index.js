const suits = ['heart', 'diamond', 'spade', 'club'];
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

const SUIT_COLORS = {
  'heart': 'red',
  'diamond': 'red',
  'space': 'black',
  'club': 'black'
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.color = SUIT_COLORS[suit];
    this.value = value;
  }

  get cardName() { 
    const { value, suit } = this;

    return `${suit}_${
      value == '11' ? 'jack' :
      value == '12' ? 'queen' :
      value == '13' ? 'king' : value
    }`;
  } 
  
  render(element, closed) {
    const { cardName } = this;

    element.innerHTML += 
      `<svg viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#` +
        `${closed ? 'back' : cardName}` +
      `" />`
  }
}

class Cols {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  render() {
    const { element, cards } = this;

    cards.forEach((card, index) => {
      card.render(element, index < cards.length - 1)
    })
  }
}

const cards = 
      [].concat.apply([],
                      suits.map(suit => values.map(value => new Card(suit, value))))

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let deck = []
while (cards.length) {
  deck.push(
    cards.splice(getRandomInt(cards.length), 1)[0]
  )
}

const col_1 = new Cols('col1')
const col_2 = new Cols('col2')
const col_3 = new Cols('col3')
const col_4 = new Cols('col4')
const col_5 = new Cols('col5')
const col_6 = new Cols('col6')
const col_7 = new Cols('col7')

deck.forEach((card, index) => {
  let currentCol = col_1
  if (index > 0) currentCol = col_2;
  if (index > 2) currentCol = col_3;
  if (index > 5) currentCol = col_4;
  if (index > 9) currentCol = col_5;
  if (index > 14) currentCol = col_6;
  if (index > 20) currentCol = col_7;
  if (index > 27) return

  currentCol.addCard(card)
})

col_1.render()
col_2.render()
col_3.render()
col_4.render()
col_5.render()
col_6.render()
col_7.render()