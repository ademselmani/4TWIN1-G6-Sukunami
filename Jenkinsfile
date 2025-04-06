pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'   
        maven 'M2_HOME'   
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'zeinebmaatalli', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
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

        // stage('MVN SONARQUBE') {
        //     steps {
        //         sh "mvn sonar:sonar -Dsonar.login=1d228746e7c33b89c2c7ef53f264cedbea068852  -Dmaven.test.skip=true"
        //     }
        // }
        stage('Deploy to Nexus'){
            steps{
                sh 'mvn deploy -Dmaven.test.skip=true'
            }
        }
    }


}
