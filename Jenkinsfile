pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKERHUB_USERNAME = 'ushanvidu'
        
        // AWS Credentials
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')

        // Fix for Terraform local credentials conflict
        AWS_SHARED_CREDENTIALS_FILE = '/dev/null'
        AWS_CONFIG_FILE             = '/dev/null'

        PATH = "/usr/local/bin:/usr/local/sbin:/opt/homebrew/bin:$PATH"
        FRONTEND_IMAGE = "frontend"
        BACKEND_IMAGE = "backend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/ushanvidu/myproject_devops.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                // Force AMD64 platform for AWS compatibility
                sh 'docker build --platform linux/amd64 -t $FRONTEND_IMAGE:latest ./frontend'
                sh 'docker build --platform linux/amd64 -t $BACKEND_IMAGE:latest ./backend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh """
                docker tag $FRONTEND_IMAGE:latest $DOCKERHUB_USERNAME/$FRONTEND_IMAGE:latest
                docker tag $BACKEND_IMAGE:latest $DOCKERHUB_USERNAME/$BACKEND_IMAGE:latest

                docker push $DOCKERHUB_USERNAME/$FRONTEND_IMAGE:latest
                docker push $DOCKERHUB_USERNAME/$BACKEND_IMAGE:latest
                """
            }
        }

        stage('Deploy with Terraform') {
                    steps {
                        dir('terraform') {
                            sh 'terraform init'
                            // We removed the SSH_KEY parts. Terraform handles the rest.
                            sh "terraform apply -auto-approve -var='docker_username=${DOCKERHUB_USERNAME}'"
                        }
                    }
                }

        stage('Clean Up') {
            steps {
                script {
                    sh 'docker logout'
                    sh 'docker system prune -af || true'
                }
            }
        }
    }
}