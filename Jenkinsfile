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
        stage('Quality Checks') {
            steps {
                script {
                    docker.image('node:24-alpine').inside {
                        sh 'npm ci && npm run typecheck && npm test'
                    }
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
        stage('Smoke Test') {
            steps {
                script {
                    docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").withRun('') { container ->
                        sh """
                            docker exec ${container.id} node -e '
                                const deadline = Date.now() + 30000;
                                async function probe() {
                                    try {
                                        const response = await fetch("http://127.0.0.1:3000/");
                                        if (!response.ok) throw new Error("HTTP " + response.status);
                                        console.log("Smoke test passed");
                                    } catch (error) {
                                        if (Date.now() >= deadline) {
                                            console.error(error);
                                            process.exit(1);
                                        }
                                        setTimeout(probe, 1000);
                                    }
                                }
                                probe();
                            '
                        """
                    }
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