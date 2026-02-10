const colors = ['Red', 'Blue', 'Green', 'Yellow'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let deck = [];
let hand = [];
let discard = null;

function initGame() {
    // Create Deck
    for (let c of colors) {
        for (let v of values) {
            deck.push({ color: c, value: v });
        }
    }
    deck.sort(() => Math.random() - 0.5); // Shuffle

    // Initial Hand
    for (let i = 0; i < 5; i++) hand.push(deck.pop());
    discard = deck.pop();
    render();
}

function render() {
    const handDiv = document.getElementById('player-hand');
    const discardDiv = document.getElementById('discard-pile');
    
    handDiv.innerHTML = '';
    hand.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = `card ${card.color}`;
        el.innerText = card.value;
        el.onclick = () => playCard(index);
        handDiv.appendChild(el);
    });

    discardDiv.className = `card ${discard.color}`;
    discardDiv.innerText = discard.value;
}

function playCard(index) {
    const card = hand[index];
    if (card.color === discard.color || card.value === discard.value) {
        discard = hand.splice(index, 1)[0];
        render();
    } else {
        alert("You can't play that card!");
    }
}

function drawCard() {
    if (deck.length > 0) {
        hand.push(deck.pop());
        render();
    }
}

initGame();