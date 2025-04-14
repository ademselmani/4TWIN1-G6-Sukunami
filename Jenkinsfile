pipeline {
    agent any


    tools {
        jdk 'JAVA_HOME'
        maven 'M2_HOME'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'youssef', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
            }
        }

        stage('Compile') {
            steps {
                sh 'mvn clean compile'
            }
        }

                stage('Run Unit Tests') {
                    steps {
                        sh 'mvn test'
                    }
                }

                        stage('MVN SONARQUBE') {
                            steps {
                                sh "mvn sonar:sonar -Dsonar.login=sqa_12defa566ba92b9f8ebed75b4609633e30d50a64 -Dmaven.test.skip=true"
                            }
                        }

        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }


}
}