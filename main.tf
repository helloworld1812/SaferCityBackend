provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "SaferCity-Backend"{
  ami = "ami-74871414"
  instance_type = "t2.micro"

  tags {
    Name = "SaferCity-Backend-Test"
  }
}
