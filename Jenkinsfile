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
        stage('Secret Scan') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:v8.24.2').inside('--entrypoint=') {
                        sh 'gitleaks detect --source . --redact --exit-code 1'
                    }
                }
            }
        }
        stage('Quality Checks') {
            steps {
                script {
                    docker.image('mcr.microsoft.com/playwright:v1.63.0-noble').inside {
                        sh 'npm ci --cache /tmp/npm-cache && npm run typecheck && npm test'
                    }
                }
            }
        }
        stage('Browser Smoke Test') {
            steps {
                script {
                    docker.image('mcr.microsoft.com/playwright:v1.63.0-noble').inside {
                        sh 'npm run test:e2e'
                    }
                }
            }
            post {
                always {
                    junit testResults: 'test-results/e2e-junit.xml', allowEmptyResults: true
                }
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