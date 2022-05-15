const gameResultContainer = document.querySelector(
  '.game-result-container'
) as HTMLDivElement;
const gameMessage = document.querySelector(
  '.game-message'
) as HTMLHeadingElement;

const moveBtns = document.querySelectorAll<HTMLButtonElement>(
  '[data-type="button"]'
);
const restartBtn = document.querySelector('.restart-btn') as HTMLButtonElement;
const fightBtn = document.querySelector('.fight-btn') as HTMLButtonElement;

const gameResultText = document.querySelector(
  '.game-result-text'
) as HTMLHeadingElement;

const computerHeartStats = document.querySelector(
  '.computer-heart-stats'
) as HTMLElement;
const computerEnergyStats = document.querySelector(
  '.computer-energy-stats'
) as HTMLElement;
const computerMoveField = document.querySelector(
  '.computer-move'
) as HTMLElement;

const playerHeartStats = document.querySelector(
  '.player-heart-stats'
) as HTMLElement;
const playerEnergyStats = document.querySelector(
  '.player-energy-stats'
) as HTMLElement;
const playerMoveField = document.querySelector('.player-move') as HTMLElement;

const heartIcons = {
  active: '<i class="bi bi-heart-fill"></i>',
  empty: '<i class="bi bi-heart"></i>',
};
const energyIcons = {
  active: '<i class="bi bi-lightning-charge-fill"></i>',
  empty: '<i class="bi bi-lightning-charge"></i>',
};
const shieldIcon = '<i class="bi bi-shield-fill"></i>';
const attackIcon = '<i class="bi bi-magic mr-1"></i>';

const moves: {
  charge: string;
  defend: string;
  attack: string;
} = {
  charge: 'charge',
  defend: 'defend',
  attack: 'attack',
};

const maxStatus = 3;

const gameStatus = {
  player: {
    energy: 1,
    heart: 3,
  },
  computer: {
    energy: 1,
    heart: 3,
  },
};

let playerPickedMove: string = '';

function restart() {
  gameResultContainer.classList.add('hidden');

  // set back to origin
  gameStatus.player.energy = 1;
  gameStatus.computer.energy = 1;
  gameStatus.player.heart = 3;
  gameStatus.computer.heart = 3;

  setHeartAndEnergyUI();

  clearMoveButtonsDisable();
  playerPickedMove = '';
  updateMoveField();
  updateGameMessage('VS');
}

restartBtn.addEventListener('click', restart);

/********** SHARE **********/
// update move field with picked icon
function updateMoveField(player?: 'player' | 'computer', move?: string) {
  let selectedPlayer: HTMLElement | any;

  if (player === 'player') {
    selectedPlayer = playerMoveField;
  } else if (player === 'computer') {
    selectedPlayer = computerMoveField;
  }

  if (move === moves.attack) {
    selectedPlayer.innerHTML = attackIcon;
    return;
  }
  if (move === moves.charge) {
    selectedPlayer.innerHTML = energyIcons.active;
    return;
  }
  if (move === moves.defend) {
    selectedPlayer.innerHTML = shieldIcon;
    return;
  }
  computerMoveField.innerHTML = '';
  playerMoveField.innerHTML = '';
}

/********** FIGHT BUTTON **********/
// make move buttons disable
function setMoveButtonsDisable() {
  moveBtns.forEach(btn => (btn.disabled = true));
}
// clear move buttons disable
function clearMoveButtonsDisable() {
  moveBtns.forEach(btn => (btn.disabled = false));
}

// get random move for computer
function getRandomMove(): string | any {
  const playerEnergy = gameStatus.player.energy;
  const computerEnergy = gameStatus.computer.energy;

  if (playerEnergy === 0 && computerEnergy === 0) {
    // both energy empty => charge
    return moves.charge;
  }

  let moveNumber = Math.floor(Math.random() * (3 - 1 + 1)) + 1;

  if (computerEnergy === 0) {
    // computer can only charge or defend
    // energy empty => give charge or defend
    let tempNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    moveNumber = tempNum;
  }

  if (computerEnergy === maxStatus) {
    // player or computer can only attack or defend
    // energy full => give attack or defend
    // player energy full => attack or defend
    let tempNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    moveNumber = tempNum + 1; // to give number 2 or 3
  }

  if (
    playerEnergy === 0 &&
    computerEnergy > 0 &&
    computerEnergy !== maxStatus
  ) {
    // player can only charge or defend
    // computer can do all
    // since player cannot attack => charge or attack
    let tempNum = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
    if (tempNum === 1) {
      moveNumber = 1;
    }
    if (tempNum === 2) {
      moveNumber = 3;
    }
  }

  // 1 for charge
  // 2 for defend
  // 3 for attack
  if (moveNumber === 1) {
    return moves.charge;
  }
  if (moveNumber === 2) {
    return moves.defend;
  }
  if (moveNumber === 3) {
    return moves.attack;
  }
}

// for update game status
function setGameStatus(player: 'player' | 'computer', move: string) {
  const a = gameStatus[player];

  if (move === moves.attack) {
    return a.energy--;
  }
  if (move === moves.charge) {
    return a.energy++;
  }
}

// checking win or lose
function checkWinOrLose(player: string, computer: string): string | any {
  if (player === moves.attack && computer === moves.attack) {
    return 'Draw';
  }
  if (player === moves.attack && computer === moves.charge) {
    gameStatus.computer.heart--;
    return 'Win';
  }
  if (player === moves.charge && computer === moves.attack) {
    gameStatus.player.heart--;
    return 'Lose';
  }
  return '-';
}

// showing match result on game message element
function updateGameMessage(msg: string) {
  gameMessage.innerHTML = msg;
}

/*
enable buttons
disable charge button if energy is max
disable attack button if energy is empty
clear playerPickedMove to ''
clear move fields
put VS back in game message
*/
function setNewMatch() {
  fightBtn.disabled = false;
  clearMoveButtonsDisable();

  if (gameStatus.player.energy === maxStatus) {
    moveBtns.forEach(btn => {
      if (btn.dataset.move === 'charge') {
        btn.disabled = true;
      }
    });
  }
  if (gameStatus.player.energy === 0) {
    moveBtns.forEach(btn => {
      if (btn.dataset.move === 'attack') {
        btn.disabled = true;
      }
    });
  }

  playerPickedMove = '';
  updateMoveField();
  updateGameMessage('VS');
}

// checking is game over
function checkIsGameOver() {
  if (gameStatus.player.heart !== 0 && gameStatus.computer.heart !== 0) return;

  if (gameStatus.player.heart === 0) {
    gameResultText.innerHTML = 'Game Over!!!';
  }
  if (gameStatus.computer.heart === 0) {
    gameResultText.innerHTML = 'Congratulations';
  }

  gameResultContainer.classList.remove('hidden');
}

// get computer's move and player's move and check win or lose
function fight() {
  if (!playerPickedMove) return;
  fightBtn.disabled = true;
  setMoveButtonsDisable();

  let playerMove = playerPickedMove;
  let computerMove = getRandomMove();
  // update computer's move field with ramdom move
  updateMoveField('computer', computerMove);

  // change game status according to picked move
  setGameStatus('player', playerMove);
  setGameStatus('computer', computerMove);

  // checking win or lose
  // reduce 1 heart if lose add 1 heart if win
  const matchResult = checkWinOrLose(playerMove, computerMove);

  updateGameMessage(matchResult);

  // update heart and energy icons in UI according to game status
  setHeartAndEnergyUI();

  setTimeout(() => {
    setNewMatch();
    checkIsGameOver();
  }, 1000);
}

fightBtn.addEventListener('click', fight);

/********** MOVE BUTTONS **********/
// ADDING EVENT LISTENER
moveBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const move = this.dataset.move as string;

    playerPickedMove = move;
    updateMoveField('player', move);
  });
});

/********** FOR GAME STATUS HEART & ENERGY **********/
// return icons in string
function getIconsString(
  currentStatus: number,
  iconType: { active: string; empty: string }
) {
  let emptyStats: number = maxStatus - currentStatus;
  let iconStr: string = '';
  for (let i = 0; i < currentStatus; i++) {
    iconStr += iconType.active;
  }

  for (let i = 0; i < emptyStats; i++) {
    iconStr += iconType.empty;
  }

  return iconStr;
}
// update ui according to game status in html
function setHeartAndEnergyUI() {
  const playerEnergy = gameStatus.player.energy;
  const playerHeart = gameStatus.player.heart;
  const computerEnergy = gameStatus.computer.energy;
  const computerHeart = gameStatus.computer.heart;

  playerEnergyStats.innerHTML = getIconsString(playerEnergy, energyIcons);
  playerHeartStats.innerHTML = getIconsString(playerHeart, heartIcons);
  computerEnergyStats.innerHTML = getIconsString(computerEnergy, energyIcons);
  computerHeartStats.innerHTML = getIconsString(computerHeart, heartIcons);
}
window.addEventListener('load', () => setHeartAndEnergyUI());
