  stage('GIT') {
            steps {
                git branch: 'gestionuser', url: 'https://github.com/nadahassen/EspritClubs-Back.git'
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
