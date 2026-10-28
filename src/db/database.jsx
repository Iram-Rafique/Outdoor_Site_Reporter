import Dexie from 'dexie'

export const db = new Dexie('OutdoorReporterDB')

db.version(1).stores({
  reports: '++id, type, category, title, createdAt',
})