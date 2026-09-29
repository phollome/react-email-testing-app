pipeline {
    agent any
    environment {
        IMAGE_NAME = 'phollome/react-email-testing-app'
        APP_NAME = 'react-email-testing-app'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub'
        REPO_URL = 'https://github.com/phollome/react-email-testing-app.git'
        BRANCH_NAME = 'main'
        TAG = "${env.BUILD_NUMBER}"
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
                    def image = docker.build("${IMAGE_NAME}:${TAG}")
                    image.tag('latest')

                }
            }
        }
        stage('Trivy Scan') {
            steps {
                sh """
                    docker run --rm \\
                        --volume /var/run/docker.sock:/var/run/docker.sock \\
                        --volume trivy-cache:/root/.cache/ \\
                        aquasec/trivy:0.74.0 \\
                        image --db-repository ghcr.io/aquasecurity/trivy-db:2 --scanners vuln --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 ${IMAGE_NAME}:${TAG}
                """
            }
        }
        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS_ID) {
                        docker.image("${IMAGE_NAME}:${TAG}").push()
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                sh "microk8s kubectl apply -f k8s/"
                sh "microk8s kubectl set image deployment/${APP_NAME} ${APP_NAME}=${IMAGE_NAME}:${TAG}"
                sh "microk8s kubectl rollout status deployment/${APP_NAME} --timeout=120s"
            }
        }
    }
    post {
        success {
            echo "Build and deployment succeeded for image: ${IMAGE_NAME}:${TAG}"
        }
        failure {
            echo "Build failed - see logs for details"
        }
    }
}