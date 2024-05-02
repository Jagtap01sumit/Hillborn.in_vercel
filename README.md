# AWS Deployment 
### 1.	Create two roles
### 2.	Create and launch Ec2 Intance



## First we need to create two roles
### 1.	First role
 #### IAM-> create roles
 #### Service or use case ->select-> EC2->Next
 #### Add Permission -> AmazonEc2RoleforCodeDeploy->Next
#### Enter Role Name -> Ec2CodeDeployRole_sumit->Next
### 2.	Second role
#### Create roles 
#### Services or use Case->select-> codedeploy->Next
#### Add Permissions -> no change ->Next
#### Enter Role Name-> name->ex. CodeDeployRole_sumit-> create role;


## After creating role we create EC2 Instance 

#### >create Ec2 Instance
#### Launch Instance -> Instance name -> quick start->aws linux(os)Key pair(logic) -> create key ->Advance Detail -> IAM instance profile-> select created role
#### User data-> we just enter the script that requires execute while launching ec2 instance
# Script Example:
##### #!/bin/bash
##### sudo yum -y update
##### sudo yum -y install ruby
##### sudo yum -y install wget
##### cd /home/ec2-user
##### wget https://aws-codedeploy-ap-south-1.s3.ap-south-1.amazonaws.com/latest/install
##### sudo chmod +x ./install
##### sudo ./install auto
##### sudo yum install -y python-pip
##### sudo pip install awscli

#### ->Launch Instance

# Create Pipeline	
### 1.	create application
### 1.1.	create deployment group
#### ->search codePipeline
#### ->codeDeploy
### First we create application connect repo. through pipeline 
#### ->create application -> application name-> ex. Sumit_CICD-> compute platform->Ec2/on-Premises->create application

## Create Deployment Group
#### Create Deployment Group-> Deployment group name-> Ex. Sumit_CICD_DP->select codeDeploymet role -> (second role)-> Environment configuration->Amazon Ec2 Instance-> Enter key and value-> select created application ->Ex. Sumit-CICD -> disable load balance ( if no more than one ec2 instances are live) -> create deployment group.

## Create Pipeline
#### codePipelines->Pipelines->create Pipeline
#### name->ex . Sumit_CICD_Pipeline->Next
#### Pipeline type->v2->Next
#### Add source stage->source provider->select github->
#### connection name . ex . Hillborn_Tech_git-> Install new app-> login to github-> select project you want to deploy->connect

#### ->select Repository name->select default brance->->trigger filter-> select no filter->Next

#### Skip build Stage

#### Add deploy stage->select AWS codeDeploy-> select application name and deployment group name->Next

#### ->Review and create pipeline

### Change security group
#### EC2-> select instance -> security -> security groups->Edit Inbound Rules->Add Inbound rules -> type http & all traffic -> source-> anywhere ipv4->save rules

## Create appspec.yml file 
## Create a folder name -> scripts
###  Inside script create 3 files :
#### 1.	start_server
#### 2.	install_dependencies
#### 3.	stop_server
## How to open amazon linux cmd panel
### Instance-> right click on instance -> connect ->Ec2 connect Instance->connect 


## To apply reverse proxy for our react app we use nginx.

### -To make reverse Proxy possible we go to /etc/nginx/conf.d  (directory) and create new file configuration.conf 

## How to create file configuration.conf
#### cd /etc/nginx/conf.d ->enter
#### sudo nano configuration.conf -> create configuration file and read , write operation.
#### Then we paste following script in this file…
##### server {
##### server_name << Your EC2 IP> > ; 
##### location / {
   #####     proxy_pass http://127.0.0.1:<< Your Project local Port> >;
   #####     }
   ##### }
### After this we save this file using following cmd or actions;
#### Ctr+O -> enter        ….save
#### Ctr + X ->enter       …..exit
 






