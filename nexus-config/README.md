# Nexus Repository Configuration for Kaddem Project

This directory contains configuration files for integrating your project with Sonatype Nexus Repository Manager.

## Setup Instructions

### 1. Fix pom.xml (Important)

Your pom.xml file has some XML syntax issues that need to be fixed:

- Find all instances of `<n>` tags and replace them with `<name>` tags
- In particular, fix these sections:
  - `<n>kaddem</n>` should be `<name>kaddem</name>` in the project metadata
  - In the distributionManagement section, fix:
    - `<n>Releases</n>` to `<name>Releases</name>`
    - `<n>Snapshots</n>` to `<name>Snapshots</name>`

### 2. Configure Nexus in Jenkins

1. Install the Nexus Repository Manager plugin in Jenkins if not already installed
2. Add your Nexus credentials to Jenkins credentials store
3. Configure the Maven settings in Jenkins to use these credentials

### 3. Using Maven Settings

Copy the provided `settings.xml` to your local `~/.m2/` directory to use Nexus for local development.

```bash
cp settings.xml ~/.m2/
```

Remember to update the password in the settings.xml file with your actual Nexus password.

### 4. Required Nexus Repositories

Make sure these repositories are created in your Nexus instance:

1. **maven-releases** (hosted repository)
2. **maven-snapshots** (hosted repository)
3. **maven-group** (group repository containing both above repositories)

### 5. Deployment Commands

To manually deploy your project to Nexus:

```bash
mvn clean deploy -DskipTests
```

## Troubleshooting

If you encounter issues with deployment to Nexus:

1. Verify that Nexus is running and accessible at http://localhost:8081
2. Check that your credentials in settings.xml are correct
3. Ensure the distributionManagement section in pom.xml has the correct URLs
4. Verify that you have the appropriate permissions in Nexus

For more information, refer to the [Nexus Repository Manager Documentation](https://help.sonatype.com/repomanager3). 