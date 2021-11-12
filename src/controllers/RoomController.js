const { Database } = require('sqlite')
const DataBase = require('../db/config')

module.exports = {
  async create(req, res) {
    const db = await DataBase()
    const password = req.body.password
    let roomId
    let isRoom = true
    
    while (isRoom) {
      //while - funciona se o isRoom for TRUE
      for (var i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString())
      }
      //  verifica se esse número já existe
      const roomsExistIds = await db.all(`SELECT id FROM rooms`)
      isRoom = roomsExistIds.some(roomsExistIds => roomsExistIds === roomId) // some - Retorna true se existir
      if (!isRoom) {
        // inseri sala no Database
        await db.run(`INSERT INTO rooms (
          id,
          password
        ) VALUES (
            ${parseInt(roomId)},
            ${password}
        ) `)

      }
    }

    await db.close()

    res.redirect(`/room/${roomId}`)
  },

  async open(req, res) {
    const db = await DataBase()
    
    const roomId = req.params.room 
    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    )
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 1`
    )
    
    let isNoQuestions

    if (questions.length == 0) {
      if (questionsRead.length == 0) {
        isNoQuestions = true
      }
    }
    
      
    res.render('room', {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead,
      isNoQuestions: isNoQuestions
    })
  },

  enter(req, res) {
    const roomId = req.body.roomId

    res.redirect(`/room/${roomId}`)
  }
}