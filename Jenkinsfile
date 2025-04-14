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


        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }

                        stage('MVN SONARQUBE') {
                            steps {
                                sh "mvn sonar:sonar -Dsonar.login=squ_ecf6cf5b28cf7330031e8fdc913940a1efc5dcca -Dmaven.test.skip=true"
                            }
                        }

}
}
