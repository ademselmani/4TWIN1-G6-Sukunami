  stage('GIT') {
            steps {
                git branch: 'mehdibenhadjyahia_4TWIN1_G6', url: 'https://github.com/nadahassen/EspritClubs-Back.git'
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
