pipeline {
    agent any
    environment {
        IMAGE_NAME = 'react-email-testing-app'
        REPO_URL = 'https://github.com/phollome/react-email-testing-app.git'
        BRANCH_NAME = 'main'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH_NAME}", url: "${REPO_URL}"
            }
        } 
        stage('Build Image') {
            steps {
                script {
                    def image = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
                    image.tag('latest')

                }
            }
        }
    }
    post {
        success {
            echo "Build succeeded for image: ${IMAGE_NAME}:${env.BUILD_NUMBER} (also tagged ${IMAGE_NAME}:latest)"
        }
        failure {
            echo "Build failed - see logs for details"
        }
    }
}