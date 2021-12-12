# online-classroom

<img src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## A website to help students and teachers collaborate virtually
<br />  

![preview1](https://user-images.githubusercontent.com/57137595/145704831-7e644956-efcf-4af1-b680-96317055b4b3.png)

<br />

## Important Links :

- Access the web app at: https://vaccine-scheduler-2021-app.herokuapp.com/
- Find the api docs at: https://vaccine-scheduler-2021-backend.herokuapp.com/docs

<br />  

## System synopsis :

This system predicts the optimal ratio of vaccines to be transferred from various vaccine warehouses of West-Bengal to the districts (zones) of West-Bengal. To make the prediction it takes into account several factors such as - distance between warehouses and zones, various epidemiological factors, current vaccination and infected status of the district etc. These predictions are rendered in the form of a web app.

<br />

## Developer guide

This system has 2 separate parts and code for each part is in their respective branch :

- **Backend branch**: Contains the datasets and the code to collect the datasets, code for predicting vaccine ratio ratio and also the code for the backend api which is built using python FastAPI.

- **Frontend branch**: Contains the code for building the UI using ReactJS.

Backend and Frontend services are deployed separately on heroku. CI/CD is implemented using github workflows in each branch.

<br />  
  

## Technologies Used :

<img alt="React" align="left" width="50px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" />

<img alt="Fastapi" align="left" width="50px" height="50px" src="https://bharatsraj.com/wp-content/uploads/2021/05/fastapi.png" /> 

<img alt="Postgresql" align="left" width="50px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/postgresql/postgresql.png" />

<img alt="SqlAlchemy" align="left" width="50px" height="50px" src="https://hakin9.org/wp-content/uploads/2019/08/connect-a-flask-app-to-a-mysql-database-with-sqlalchemy-and-pymysql.jpg" />

<img alt="Heroku Postgres" align="left" width="100px" height = "50px" src="https://miro.medium.com/max/1200/1*PR3N41Yzq0bEQw9imFmrJQ.png" /> 

<img alt="JWT" align="left" width="100px" height="50px" src="https://www.devonblog.com/wp-content/uploads/2018/08/jwt_05.jpg" />

<img alt="Heroku" align="left" width="100px" height = "50px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFBvyZwtWapclJnU5s993F63khm4I_vEbE0U9LVpydYK5ZBxe_vqq6pHfOWaQjN9oWu6E&usqp=CAU" /> 

<br /><br /><br />
- Frontend: ***ReactJS***
- Backend: ***FastAPI***
- Database: ***Postgresql***
- ORM: ***SqlAlchemy***
- DBaaS: ***Heroku postgres***
- Authentication & Authorization: ***JWT***
- PaaS: ***Heroku***

<br />

## How to contribute ?

To contribute to a particular section of the system :

- Clone the repo
- Switch to the appropriate branch (see the [Developer guide](#developer-guide) to know more about the branch structure)
- Make a PR to that branch
