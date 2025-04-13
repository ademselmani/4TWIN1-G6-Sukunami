pipeline {
    agent any

    environment {
        IMAGE_NAME = 'mohamedbsila/kaddem'
        COMPOSE_FILE = 'docker-compose.yml'
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
        SONAR_TOKEN = 'sqa_1e5900c71d8156d237b159cd4f4494f5f6fc9fa2'
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
        
         stage('MVN Sonarqube') {
                 steps {
                     sh 'mvn sonar:sonar -Dsonar.token=sqa_1e5900c71d8156d237b159cd4f4494f5f6fc9fa2 -Dmaven.test.skip=true'
           }
        }
        
        stage('Quality Gate') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    timeout(time: 1, unit: 'MINUTES') {
                        // Parameter indicates whether to set pipeline to UNSTABLE if Quality Gate fails
                        // true = set pipeline to UNSTABLE, false = don't
                        waitForQualityGate abortPipeline: false
                    }
                }
            }
        }

        stage('Package JAR') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }
        
        stage('Deploy to Nexus') {
            steps {
                sh 'mvn deploy -DskipTests -s settings.xml'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push ${IMAGE_NAME}:latest'
                sh 'docker logout'
            }
        }

        stage('Restart Services with Docker Compose') {
            steps {
                sh '''
                    # Force remove existing containers if they exist
                    docker container rm -f kaddem-app mysql-db || true
                    
                    # Check if docker-compose or docker compose command should be used
                    if command -v docker-compose &> /dev/null; then
                        docker-compose -f $COMPOSE_FILE down || true
                        docker-compose -f $COMPOSE_FILE up -d
                    else
                        docker compose -f $COMPOSE_FILE down || true
                        docker compose -f $COMPOSE_FILE up -d
                    fi
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
