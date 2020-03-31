const deck = ['H', 'T', 'C', 'P'];
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

const cards = deck.map(
  d => values.map(v => v + d)
)

let result = cards[0] + cards[1] + cards[2] + cards[3]
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

result = result.split(',')
const result2 = []
while (result.length) {
  result2.push(
    result.splice(getRandomInt(result.length), 1)[0]
  )
}

function Row() {
  this.cards = [];
}

Row.prototype.addCard = function(name) {
  this.cards.push(name)
}

for (let r = 1; r <= 7; r++) {
  const _row = new Row()
  
}