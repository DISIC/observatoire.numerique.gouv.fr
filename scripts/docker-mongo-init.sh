#!/bin/bash
mongod --port 27018 --replSet rs0 --bind_ip 0.0.0.0 &
MONGOD_PID=$!

until mongo admin --port 27018 --eval "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27018' }] }) && db.createUser({ user: 'user', pwd: 'password', roles: ['root'] })"; do
  sleep 1
done

echo "REPLICA SET ONLINE"
wait $MONGOD_PID
