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
          stage('MVN SONAREQUBE') {
            steps {
                sh 'mvn sonar:sonar -Dsonar.login=sqa_2666cef188b1921cd6389e8c3d060183acf53c95'
            }
        }
}
}
