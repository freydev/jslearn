const suits = ['heart', 'diamond', 'spade', 'club']
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

const SUIT_COLORS = {
  'heart': 'red',
  'diamond': 'red',
  'space': 'black',
  'club': 'black'
}

const ANIMATION_ORDER = {
  '60': 0,
  '61': 1,
  '62': 2,
  '63': 3,
  '64': 4,
  '65': 5,
  '66': 6,
  '50': 7,
  '51': 8,
  '52': 9,
  '53': 10,
  '54': 11,
  '55': 12,
  '40': 13,
  '41': 14,
  '42': 15,
  '43': 16,
  '44': 17,
  '30': 18,
  '31': 19,
  '32': 20,
  '33': 21,
  '20': 22,
  '21': 23,
  '22': 24,
  '10': 25,
  '11': 26,
  '00': 27,
}

class Deck {
  constructor(element, topCardContainer) {
    this.element = element
    this.cards = []
    this.topCards = []
    this.topCardContainer = topCardContainer

    element.addEventListener('click', this.handleClick.bind(this))
  }

  handleClick(event) {
    if (this.cards.length === 0) {
      this.cards = this.topCards.slice(0).reverse()
      this.topCards.length = 0
      this.render()
    }

    const currentCard = this.cards.pop()
    if (currentCard) this.topCards.push(currentCard)

    this.render()
  }

  addCard(card) {
    this.cards.push(card)
  }

  render() {
    const { topCardContainer, topCards, element, cards } = this
    element.innerHTML = `` +
      (cards.length >= 1 ? `<svg viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#back" fill="blue" /></svg>` : '') +
      (cards.length >= 8 ? `<svg viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#back" fill="blue" /></svg>` : '') +
      (cards.length >= 16 ? `<svg viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#back" fill="blue" /></svg>` : '') +
      (cards.length === 0 ? `<svg class="opacity" viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#back" fill="gray" /></svg>` : '')

    topCardContainer.innerHTML = ''
    const [ topCard ] = topCards.slice(-1)
    if (topCard)
      topCard.render(topCardContainer)
  }

  pop() {
    return this.cards.pop()
  }
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
  
  render(element, closed, startElement, colIndex, cardIndex) {
    const { cardName } = this;
    let startPosition = {};
    let delay = 0;

    if (startElement) {
      const { x: startX, y: startY } = startElement.getBoundingClientRect();
      const { x: endX, y: endY } = element.getBoundingClientRect();
      startPosition.left = -(endX - startX);
      startPosition.top = -(endY - startY);

      delay = ANIMATION_ORDER['' + colIndex + cardIndex] / 15
    }

    element.innerHTML += 
      `<svg ` +
        `style="left: ${startPosition.left}px; top: ${startPosition.top}px; opacity: ${startElement ? 0 : 1}; transition-delay: ${delay}s"` + 
        `viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#` +
        `${closed ? 'back' : cardName}` +
      `" />`

    setTimeout(() => {
      element.querySelectorAll('svg').forEach(el => el.classList.add('no-position'))
    }, 100)
  }
}

class Cols {
  constructor(elementId, index) {
    this.element = document.getElementById(elementId);
    this.index = index
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  render() {
    const { element, cards, index: colIndex } = this;

    cards.forEach((card, index) => {
      card.render(element, index < cards.length - 1, document.querySelector('.deck'), colIndex, index)
    })
  }
}

const cards = 
      [].concat.apply([],
                      suits.map(suit => values.map(value => new Card(suit, value))))

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const deck = new Deck(document.querySelector('.deck'), document.querySelector('.top-card'))

while (cards.length) {
  deck.addCard(
    cards.splice(getRandomInt(cards.length), 1)[0]
  )
}

const col_1 = new Cols('col1', 0)
const col_2 = new Cols('col2', 1)
const col_3 = new Cols('col3', 2)
const col_4 = new Cols('col4', 3)
const col_5 = new Cols('col5', 4)
const col_6 = new Cols('col6', 5)
const col_7 = new Cols('col7', 6)

for (let index = 0; index < 28; index++) {
  const card = deck.pop();
  let currentCol = col_7;
  if (index > 6) currentCol = col_6;
  if (index > 12) currentCol = col_5;
  if (index > 17) currentCol = col_4;
  if (index > 21) currentCol = col_3;
  if (index > 24) currentCol = col_2;
  if (index > 26) currentCol = col_1;

  currentCol.addCard(card)
}

deck.render()

col_1.render()
col_2.render()
col_3.render()
col_4.render()
col_5.render()
col_6.render()
col_7.render()