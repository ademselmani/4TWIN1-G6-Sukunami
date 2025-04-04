pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'   
        maven 'M2_HOME'   
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'ademselmani-4Twin1-G6', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
            }
        }

        stage('Compile') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }

        stage('MVN SONARQUBE') {
            steps {
                sh "mvn sonar:sonar -Dsonar.login=squ_a546fefc5f50e9f80714f82c88e69e723519390a -Dmaven.test.skip=true"
            }
        }
    }

    post {
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
