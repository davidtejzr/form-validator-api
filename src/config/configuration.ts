import * as process from 'node:process';

export default () => ({
  databaseUri: process.env.DATABASE_URI || 'mongodb://root:toor@mongodb:27017',
  cacheTimeMs: process.env.CACHE_TIME_MS || 86400,
  mxtoolboxApiKey: process.env.MXTOOLBOX_API_KEY || '',
});
