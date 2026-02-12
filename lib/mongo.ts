import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI || ''
if (!uri) {
  // will throw at runtime if used without config
}

let client: MongoClient | null = null

export async function getMongoClient(){
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client
}

export async function getVulnerabilitiesCollection(){
  const c = await getMongoClient()
  return c.db().collection('vulnerabilities')
}
