// Coleta os elementos do DOM para manipulação
const houses = document.getElementsByClassName('house')
const select = document.getElementById('gameType')
const restar = document.getElementById('restart')
const result = document.getElementById('winner')

const playerX = 'X' // Para o turno do O
const playerO = 'O' // Para o turno do O
let isTurn = true // Controla os turnos: X = true O = false
let end = false // Se o jogo acabar não faz nada
let gameType = 'Singleplayer' // Modo de jogo 

// Score para o algoritmo do minimax
const scores = {
  X: -1,
  O: 1,
  tie: 0
};

// Possibilidades de vitória
const winnerCond = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

// Coleta o tipo de modo de jogo
select.addEventListener('change', () => {
  gameType = select.options[select.selectedIndex].textContent
  console.log(gameType)
})

// Quando uma casa do tabuleiro é clicada mudamos o seu valor
document.addEventListener('click', (e) => {
  if (e.target.matches('.house') && !end) {
    play(e.target.id)
  }
})

// Função que realiza a jogada
function play(id) {
  const house = document.getElementById(id) // Qual cada foi clicada
  let turn = isTurn ? playerX : playerO // Verifica o turno do jogador
  let color = isTurn ? '#b8b8b8' : '#2b2b2b'  // Decide o css

  // Altera o DIM
  house.textContent = turn  
  house.style.color = color

  checkWinner(turn) // Checa se o movimento foi um vencedor

  // Caso seja singleplayer, decidimos a casa da jogada, chamando o algoritmo do mini max
  if (gameType === 'Singleplayer' && !(isTurn || end)) {
    const bestMove = getBestMove()
    if (bestMove !== -1) {
      setTimeout(() => {play(bestMove.toString())}, 100)
    }
  } 
}

// Checa se temos um vencedor 
function checkWinner(turn) {
  // Para cada combinação possível checamos se ele é possível utilizando o every
  const winner = winnerCond.some((comb) => {
    return comb.every((index) => {
      return houses[index].textContent == turn
    })
  })

  // Se temos um vencedor ou empate, mudamos o turno, se não muda o jogador
  if (winner) {
    endGame(turn)
  } else if (checkTie()) {
    endGame()
  } else {
    isTurn = !isTurn
  }
}

// Checa se tivemos um empate
function checkTie() {
  let count = 0

  // Se todas as casas forem preenchidas temos um empate
  for (i in houses) {
    if (!isNaN(i) && (houses[i].textContent === playerX || houses[i].textContent == playerO)) {
      count++
    }
  }

  return count === 9 ? true : false
}

function endGame(winner = null) {
  // Checamos se houve um vencedor, em caso positivo imprimimos ele, senão empate
  if (winner) {
    setTimeout(() => {result.innerHTML = isTurn ? 'The winner is X' : 'The winner is O'}, 300)
  } else if (checkTie()) {
    result.innerHTML = 'Tie, nice try!'
  }

  end = !end  // Considera o jog terminado, pra IA não completar o resto

  let count = 3 // Contador de reinicio
  
  setInterval(() => {restar.innerHTML = 'Restarting in ' + count--}, 1000) 

  setTimeout(() => location.reload(), 4000) // Reinicia
}

// Retorna a melhor jogada possível utilizando o algoritmo do minimax
function getBestMove() {
  let bestScore = -Infinity
  let move = -1

  // Percorremos todas as casas vazias e atribuimos um valor para esta casa, 
  // assim, nos chamas a função minimax que calcula a maior pontuação. 
  // Por fim, restaura o conteúdo original e retorna o melhor movimento.
  for (let i = 0; i < houses.length; i++) {

    if (houses[i].textContent === '') { // Checa se temos uma casa vazia

      houses[i].textContent = playerO // Colocamos o conteúdo
      let score = minimax(houses, 0, false) // minimax
      houses[i].textContent = ''  // Voltamos ao estado original

      // Melhor score possível
      if (score > bestScore) {
        bestScore = score
        move = i

      }
    }
  }

  return move
}

// Para cada possíbilidade do tabuleiro, o algoritmo analisa as combinações e 
// decide qual possuiu a maior pontuação.
function minimax(board, depth, isMaximizing) {
  const result = checkResult(board)

  // Se o resultado exitir acessamos o score dele.
  if (result !== null) {
    return scores[result]
  }
  
  // A função é recursiva e utiliza um parâmetro isMaximizing para alternar 
  // entre a maximização (jogador O) e minimização (jogador X) dos resultados. 
  // Se isMaximizing for verdadeiro, o algoritmo maximiza a pontuação, percorrendo 
  // todas as casas vazias do tabuleiro
  if (isMaximizing) { // Maximiza a pontuação
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {

      if (board[i].textContent === '') {
        board[i].textContent = playerO
        let score = minimax(board, depth + 1, false)
        board[i].textContent = ''
        bestScore = Math.max(score, bestScore)

      }
    }

    return bestScore;

  } else {  // Minimiza a pontuação
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i].textContent === '') {
        board[i].textContent = playerX
        let score = minimax(board, depth + 1, true);
        board[i].textContent = ''
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore;
  }
}

function checkResult(board) {
  for (let i = 0; i < winnerCond.length; i++) {
    const [a, b, c] = winnerCond[i];

    // Checa se as casas no tabuleiro possuem o mesmo conteúdo e não estão vazias.
    if (board[a].textContent && board[a].textContent === board[b].textContent && board[b].textContent === board[c].textContent) {
      return board[a].textContent;
    }
  }

  // Verifica se temos empate
  if (checkTie()) {
    return 'tie';
  }

  return null;
}
