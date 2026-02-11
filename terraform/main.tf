provider "aws" {
  region = "us-east-1"
}

variable "docker_username" {
  type    = string
  default = "ushanvidu"
}

resource "aws_security_group" "app_sg" {
  name        = "mern-app-sg"
  description = "Allow Web and SSH traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 (us-east-1)
  instance_type = "t3.micro"
  key_name      = "my-key-pair"

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # This script runs AUTOMATICALLY when the server starts
  user_data = <<-EOF
              #!/bin/bash
              # 1. Update and install Docker & Docker Compose
              sudo apt-get update -y
              sudo apt-get install -y docker.io

              # Install standalone docker-compose (fixes plugin issues)
              sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose

              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu

              # 2. Setup the application directory
              mkdir -p /home/ubuntu
              cd /home/ubuntu

              # 3. Create docker-compose.yml
              cat <<EOT >> docker-compose.yml
              version: '3.8'
              services:
                backend:
                  image: ${var.docker_username}/backend:latest
                  ports:
                    - "8000:8000"
                  restart: always
                  environment:
                    - PORT=8000
                    - MONGO_URL=mongodb+srv://ushanviduranga:Ananda%402002@cluster0.cq7gwxi.mongodb.net/DevOps

                frontend:
                  image: ${var.docker_username}/frontend:latest
                  ports:
                    - "80:5173"
                  depends_on:
                    - backend
                  restart: always
              EOT

              # 4. Pull and Start the App
              # We use the full path to ensure it runs correctly in the boot script
              /usr/local/bin/docker-compose pull
              /usr/local/bin/docker-compose up -d
              EOF

  tags = {
    Name = "Jenkins-MERN-App"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}