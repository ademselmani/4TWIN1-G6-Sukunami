pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'   
        maven 'M2_HOME'   
    }

    stages {

        stage('GIT') {
            steps {
                git branch: 'zeinebmaatalli-4TWIN1-G6', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
            }
        }

         stage('Compile Stage') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }
    }

 
}
