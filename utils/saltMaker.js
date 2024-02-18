const saltMaker = () => Math.floor(Math.random() * (10 - 5 + 1)) + 5 // random number between 5 & 10

export { saltMaker }
