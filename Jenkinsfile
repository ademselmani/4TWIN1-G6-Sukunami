pipeline {
    agent any

    tools {
        jdk 'JAVA_HOME'       
        maven 'M2_HOME'       
    }

    environment {
        IMAGE_NAME = 'youssef'
        DOCKER_USERNAME = 'ysfbs'
        DOCKER_PASSWORD = 'Ysf@2001.com'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Say Hello') {
            steps {
                echo '🚀 Pipeline started by Youssef!'
            }
        }

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
                sh "mvn sonar:sonar -Dsonar.login=squ_9e865e191e1f82abe7253f066e3b553cac3c4df6 -Dmaven.test.skip=true"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    docker push $IMAGE_NAME
                '''
            }
        }

        stage('Restart Services with Docker Compose') {
            steps {
                sh '''
                    docker-compose -f $COMPOSE_FILE down || true
                    docker-compose -f $COMPOSE_FILE up -d
                '''
            }
        }
    }
}
