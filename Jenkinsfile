pipeline {
    agent any
stages {  
stage('GIT') {
            steps {
                git branch: 'mehdibenhadjyahia_4TWIN1_G6', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
            }
        }

        stage('MVN COMPILE') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('clean') {
            steps {
                sh 'mvn clean package'
            }
        }
          stage('Run Unit Tests') {
            steps {
                sh 'mvn test'
            }
        }
          
}
}
