require('dotenv').config()
const Model = require('./Model')

async function drop () {
  const db = await Model.db()
  const promises = (await db
    .listCollections()
    .toArray())
    .map(({ name }) => db.dropCollection(name))
  return Promise.all(promises)
}

async function init () {
  const db = await Model.db()
  const names = ['completes']
  for (const name of names) {
    await db.createCollection(name)
  }
}


drop()
init()
