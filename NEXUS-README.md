# Nexus Repository Integration Guide

This guide explains how to integrate the Kaddem project with Nexus Repository Manager.

## Prerequisites

1. Nexus Repository Manager installed and running on your VM (192.168.230.129:8081)
2. Maven installed
3. Java 8 installed

## Important: Fix POM File

The current pom.xml file has XML syntax issues. You need to manually fix these tags:

1. Change `<n>kaddem</n>` to `<name>kaddem</name>`
2. In the distributionManagement section, change:
   - `<n>Nexus Repository</n>` to `<name>Nexus Repository</name>` (in both repository and snapshotRepository)

## Required Nexus Repositories

Create these repositories in your Nexus instance:

1. **maven-releases** (hosted repository)
   - Version policy: Release
   - Layout policy: Maven 2

2. **maven-snapshots** (hosted repository)
   - Version policy: Snapshot
   - Layout policy: Maven 2

3. **maven-group** (group repository)
   - Member repositories: maven-releases, maven-snapshots, maven-central

## Maven Settings

Copy the provided `settings.xml` to your `~/.m2/` directory:

```bash
cp settings.xml ~/.m2/
```

The settings.xml file already contains your Nexus admin password.

## Deployment

### Manual Deployment

To manually deploy the project to Nexus:

```bash
mvn clean deploy -DskipTests
```

### Jenkins Deployment

The project's Jenkinsfile is already configured to deploy to Nexus as part of the CI/CD pipeline.

## Accessing Artifacts

Once deployed, you can access your artifacts through:
- Releases: http://192.168.230.129:8081/repository/maven-releases/tn/esprit/spring/kaddem/
- Snapshots: http://192.168.230.129:8081/repository/maven-snapshots/tn/esprit/spring/kaddem/

## Troubleshooting

1. **Authentication Issues**: Verify your credentials in settings.xml
2. **Connection Issues**: Make sure Nexus is running and accessible
3. **XML Format Issues**: Ensure all XML tags in pom.xml are properly formed
4. **Permission Issues**: Verify you have the correct permissions in Nexus

## Additional Resources

- [Nexus Repository Manager Documentation](https://help.sonatype.com/repomanager3)
- [Maven Deployment Documentation](https://maven.apache.org/guides/mini/guide-deploying.html) 