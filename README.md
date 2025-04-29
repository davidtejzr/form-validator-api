## Project setup

### Setup environment variables
1. Copy `.env.example` to `.env`.
2. Set the `DATABASE_URL` variable to your PostgreSQL database connection string (local instance or MongoDB Atlas).
3. Set MxToolbox API key in the `MXTOOLBOX_API_KEY` variable (for email blacklist detection).
4. Set `DATA_LOCALE` for the locale of the data you want to use (default is CZ). Remember that data must be provided for the selected locale!
5. Modify `CACHE_TIME_MS` if you want to set the cache time, in milliseconds (default is 1 day).

### Starting of Docker containers
```bash
docker-compose up -d
docker-compose exec app bash
```

### Install dependencies
```bash
docker-compose up -d
docker-compose exec app bash

$ npm install
```

### Install tools for data providers
```bash
docker-compose up -d
docker-compose exec app bash

cd data-providers && bash prepare-environment.sh
```

### Initial seed for Czech Republic (companies and addresses)
```bash
cd data-providers && bash cs_initial_seed.sh
```

## Compile and run the project (under Docker)
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests (under Docker)
```bash
# unit tests
$ npm run test
```

## License
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
