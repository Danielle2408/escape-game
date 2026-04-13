// ========== INDICES & CALCULS ==========
let secretCode = "";
let cluesData = {};

const objectsConfig = {
  desk:    { hasClue: true, digitPos: 0, operation: (d) => `${d} × 1 = ?`,    result: (d) => d },
  bag:     { hasClue: true, digitPos: 1, operation: (d) => `${d} × 1 = ?`,    result: (d) => d },
  blackboard: { hasClue: true, digitPos: 2, operation: (d) => `${d} × 1 = ?`, result: (d) => d },
  bookshelf: { hasClue: true, digitPos: 3, operation: (d) => `${d+5} – 5 = ?`, result: (d) => d },
  globe:   { hasClue: false, penalty: 5 },
  trash:   { hasClue: false, penalty: 3 }
};

function generateRandomCode() {
  const digits = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10)
  ];
  return digits.join('');
}


  return data;
}
