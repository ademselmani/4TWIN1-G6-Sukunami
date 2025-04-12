# Instructions for Fixing pom.xml

Since the automatic tools are having issues with the XML tags, here are the manual steps to fix your pom.xml file:

1. Open the pom.xml file in a text editor
2. Find this line:
   ```xml
   <n>kaddem</n>
   ```
   Change it to:
   ```xml
   <name>kaddem</name>
   ```

3. Find the distributionManagement section (which we added) and fix the tags:
   ```xml
   <distributionManagement>
       <repository>
           <id>nexus</id>
           <n>Releases</n>
           <url>http://localhost:8081/repository/maven-releases/</url>
       </repository>
       <snapshotRepository>
           <id>nexus</id>
           <n>Snapshots</n>
           <url>http://localhost:8081/repository/maven-snapshots/</url>
       </snapshotRepository>
   </distributionManagement>
   ```

   Change it to:
   ```xml
   <distributionManagement>
       <repository>
           <id>nexus</id>
           <name>Releases</name>
           <url>http://localhost:8081/repository/maven-releases/</url>
       </repository>
       <snapshotRepository>
           <id>nexus</id>
           <name>Snapshots</name>
           <url>http://localhost:8081/repository/maven-snapshots/</url>
       </snapshotRepository>
   </distributionManagement>
   ```

4. Save the file

These changes will fix the XML syntax issues and allow Maven to properly deploy to Nexus. 