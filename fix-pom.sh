#!/bin/bash

# Create a backup of the original pom.xml
cp pom.xml pom.xml.bak

# Fix the name tag
sed -i 's/<n>kaddem<\/n>/<name>kaddem<\/name>/g' pom.xml

# Fix the repository name tags
sed -i 's/<n>Nexus Repository<\/n>/<name>Nexus Repository<\/name>/g' pom.xml

echo "POM file fixed. Original file backed up as pom.xml.bak" 