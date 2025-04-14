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
                                sh "mvn sonar:sonar -Dsonar.login=sqa_e85d4099241cadd2daa45e4020fe623984192bc5 -Dmaven.test.skip=true"
                            }
                        }

        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }


}
}
