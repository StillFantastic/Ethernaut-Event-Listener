const mongodb = require('mongodb')
const errors = require('http-errors')

let _client = null

class Model {
  static async client () {
    if (!_client) {
      const { MongoClient } = mongodb
      const { DB_URI } = process.env
      _client = await MongoClient.connect(DB_URI, { useNewUrlParser: true })
    }
    
    return _client
  }

  static async db () {
    const client = await this.client()
    return client.db()
  }

  static async collection () {
    const db = await this.db()
    return db.collection(this._collection)
  }

  static async ['findOne?'] (query, options) {
    return (await this.collection()).findOne(query, options)
  }

  static async findOne (query, options) {
    const doc = await this['findOne?'](query, options)
    if (doc) return doc
    throw new errors.NotFound()
  }

  static async insertOne (query, options) {
    const collection = await this.collection()
    await collection.insertOne(query, options)
    return query
  }

  static async findOrInsertOne (query, options = {}) {
    const doc = await this['findOne?'](query, options)
    if (doc) return doc
    try {
      return await this.insertOne(query, options)
    } catch (err) {
      if (err.name === 'MongoError' && err.message.startsWith('E11000 ')) { // DuplicationError
        return this.findOne(query, options)
      }
      throw err
    }
  }
}

module.exports = Model
