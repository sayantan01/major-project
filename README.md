# Vaccine Scheduler - Backend

![](https://github.com/sayantan01/online-classroom/workflows/Deploy/badge.svg)

## Server part of the vaccine scheduler application
<br /> 

![preview4](https://user-images.githubusercontent.com/57137595/145705361-e9be8e35-5234-4279-8ee8-3356c8a4ab99.png)

<br />

## Running the api server on localhost :

Clone the repo. Switch to the branch **backend**. 
Create a file named **.env** with the following 2 environment variables :

```
DATABASE_URL = <some postgresql url>
SECRET_KEY = <some arbitrary string>
```

And then run the following commands :

```
python3 -m venv venv				# create a python3 virtual environment
source venv/bin/activate 			# activate the virtual env
pip3 install -r requirements.txt  	# install the requirements
uvicorn main:app --reload 			# run the server
```

## Access the deployed api server :
https://vaccine-scheduler-2021-backend.herokuapp.com
