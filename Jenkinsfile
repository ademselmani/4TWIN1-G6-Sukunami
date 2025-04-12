pipeline {
    agent any

    environment {
        IMAGE_NAME = 'moha/kaddem'
        DOCKER_USERNAME = 'moha'
        DOCKER_PASSWORD = 'b52100610'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    tools {
        jdk 'JAVA_HOME'   
        maven 'M2_HOME'   
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'mohamedbsila', url: 'https://github.com/ademselmani/4TWIN1-G6-Sukunami.git'
            }
        }

        stage('Compile') {
            steps {
                sh 'mvn clean compile'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }
        
        stage('Deploy to Nexus') {
            steps {
                sh 'mvn deploy -DskipTests'
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

    post {
        success {
            echo '✅ Build and Deployment successful!'
        }
        failure {
            echo '❌ Build or Deployment failed!'
        }
    }
} 