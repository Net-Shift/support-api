# Fork-it-api


## Local 

### Install dependencies
npm install

### Run app
node ace serve --watch 


## Dev 

### Create db-tunnel
scalingo --app fork-it-api db-tunnel SCALINGO_POSTGRESQL_URL

### Run migration 
scalingo --app fork-it-api run node ace migration:run   

### Deploy to Scalingo 
git push scalingo master


## Docker 

### Postgres
docker run -d -p 5432:5432 --name support_api -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=support_api postgres
docker start postgres_container

### Run migrations and seed database
node ace migration:run
node ace db:seed

### Redis
docker run -d -p 6379:6379 --name redis_container redis
docker start redis_container