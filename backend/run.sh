echo "Starting Docker Compose..."
docker-compose up --build -d

# Waiting initialization
echo "Waiting for MongoDB container to be ready..."

#This can be improved
sleep 5

echo "Entering Mongo Shell..."

#Start replica set
docker exec -it mongo mongosh --eval "rs.initiate()"

#Check replica set
docker exec -it mongo mongosh --eval "rs.status()"