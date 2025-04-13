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
                     sh '''
                        mvn clean verify sonar:sonar \
                        -Dsonar.projectKey=kaddem \
                        -Dsonar.projectName="Kaddem Application" \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.login=${SONAR_TOKEN} \
                        -Dsonar.java.source=1.8 \
                        -Dsonar.java.target=1.8 \
                        -Dsonar.sources=src/main/java \
                        -Dsonar.java.binaries=target/classes \
                        -Dsonar.maven.plugin.version=3.0.2
                     '''
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

        stage('Setup Monitoring Configuration') {
            steps {
                sh '''
                    # Ensure prometheus directory exists
                    mkdir -p prometheus
                    
                    # Copy prometheus config if it doesn't exist in workspace
                    if [ ! -f "prometheus/prometheus.yml" ]; then
                        echo "Creating default prometheus.yml"
                        cat > prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'kaddem-app'
    metrics_path: '/kaddem/actuator/prometheus'
    static_configs:
      - targets: ['kaddem-app:8082']

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOF
                    fi
                '''
            }
        }

        stage('Restart Services with Docker Compose') {
            steps {
                sh '''
                    # Stop any potentially running services on the same ports
                    docker ps | grep 9091 | awk '{print $1}' | xargs -r docker stop
                    docker ps | grep 3001 | awk '{print $1}' | xargs -r docker stop
                    
                    # Force remove existing containers if they exist
                    docker container rm -f kaddem-app mysql-db prometheus grafana || true
                    
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

        stage('Verify Monitoring Services') {
            steps {
                sh '''
                    # Wait for services to start up
                    sleep 10
                    
                    # Check if Prometheus is running
                    echo "Checking Prometheus status:"
                    curl -s http://localhost:9091/-/healthy || echo "Prometheus not responding"
                    
                    # Check if Grafana is running
                    echo "Checking Grafana status:"
                    curl -s http://localhost:3001/api/health || echo "Grafana not responding"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build and Deployment successful!'
            echo 'Access your services at:'
            echo '- Application: http://localhost:8082/kaddem'
            echo '- Prometheus: http://localhost:9091'
            echo '- Grafana: http://localhost:3001 (default login: admin/admin)'
        }
        failure {
            echo '❌ Build or Deployment failed!'
        }
    }
} 
