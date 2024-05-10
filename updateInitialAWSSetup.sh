#!/bin/bash

aws cloudformation update-stack --region us-east-1 --stack-name thumbshot-initial --template-body file://./initial-aws-setup.yml --capabilities CAPABILITY_IAM
aws cloudformation wait stack-update-complete --region us-east-1 --stack-name thumbshot-initial