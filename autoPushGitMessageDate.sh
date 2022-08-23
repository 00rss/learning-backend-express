#!/bin/bash
TODAY=$(date +"%A, %d of %B")
echo "adding all the files..."
git add *
echo 'write the message to commit:'
read message
echo "the messages was:${message}"
echo "commiting with the message..."
git commit -m "${message} ${TODAY}"
echo "pushing to repository..."
git push -u origin main