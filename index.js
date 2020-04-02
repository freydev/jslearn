const suits = ['heart', 'diamond', 'spade', 'club']
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

const SUIT_COLORS = {
  'heart': 'red',
  'diamond': 'red',
  'spade': 'black',
  'club': 'black'
}

const ANIMATION_ORDER = {
  '60': 0,
  '61': 1,
  '62': 2,
  '63': 3,
  '64': 4,
  '65': 5,
  '66': 22,
  '50': 6,
  '51': 7,
  '52': 8,
  '53': 9,
  '54': 10,
  '55': 23,
  '40': 11,
  '41': 12,
  '42': 13,
  '43': 14,
  '44': 24,
  '30': 15,
  '31': 16,
  '32': 17,
  '33': 25,
  '20': 18,
  '21': 19,
  '22': 26,
  '10': 20,
  '11': 27,
  '00': 21,
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let currentCard;
let allCards;
let cols;

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

    const topCard = topCards.slice(-1)
    if (topCard.length) {
      topCard.forEach(card => 
        card.render(topCardContainer, false, element)
      )
    }
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
    this.closed = false;
    this.col = null;
    this.cardElement = null;
    this.id = uuidv4()

    document.addEventListener('click', event => {
      const targetCardElement = event.target.parentElement
      if (targetCardElement == this.cardElement) {

        if (targetCardElement == currentCard) {
          currentCard.cardElement.classList.remove('active')
          currentCard = null
          return
        }

        if (!this.closed) {
          if (currentCard) {
            if (
              this.color != currentCard.color &&
              (parseInt(currentCard.value) + 1) == this.value
            ) {
              currentCard.col.delCard(1)
              const newCol = cols[event.target.closest('.col').getAttribute('id').replace('col', '') - 1]
              newCol.addCard(currentCard)
              newCol.render(true)
            }
            currentCard.cardElement.classList.remove('active')
          }

          setTimeout(() => {
            currentCard = this
            currentCard.cardElement.classList.add('active')
          })
        }
      }
    })
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
    this.closed = closed

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
      `<svg id="${this.id}"` +
        `style="left: ${startPosition.left}px; top: ${startPosition.top}px; opacity: ${startElement ? 0 : 1}; transition-delay: ${delay}s"` + 
        `viewBox="0 0 169.075 244.640" width="103" height="150"><use xlink:href="svg-cards-indented.svg#` +
        `${closed ? 'back' : cardName}` +
      `" />`

    
    this.cardElement = [].slice.call(element.querySelectorAll('svg'), -1).pop()

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
    card.col = this
    this.cards.push(card);
  }

  delCard(len) {
    this.cards.splice(-len)
    this.render()
  }

  render(dontChangeClosing) {
    const { element, cards, index: colIndex } = this;
    element.innerHTML = ''

    cards.forEach((card, index) => {

      card.render(element, 
        !dontChangeClosing ? index < cards.length - 1 : card.closed, 
        document.querySelector('.deck'), colIndex, index)
    })
  }
}

const cards = 
      [].concat.apply([],
                      suits.map(suit => values.map(value => new Card(suit, value))))

allCards = cards.slice(0)

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

cols = [col_1, col_2, col_3, col_4, col_5, col_6, col_7]

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
