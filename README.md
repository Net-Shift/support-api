# Fork-it-api

install dependencies and get .env file

## Run app 
node ace serve --watch 

## Create db-tunnel
scalingo --app fork-it-api db-tunnel SCALINGO_POSTGRESQL_URL

## Run migration 
scalingo --app fork-it-api run node ace migration:run   

## Deploy to Scalingo 
git push scalingo master


### Docker 

docker run -d -p 6379:6379 --name redis-server redis
docker start redis-server