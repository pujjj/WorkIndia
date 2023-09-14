# WorkIndia Task
Hey there, Mr. X. You have been appointed to design a platform like Cricbuzz, wherein guest users can come on the platform and browse across multiple matches and can see either of them in detail.
There is a Role Based Access provision and 2 types of users would exist :
* Admin - can perform all operations like adding matches, players in the teams, updating stats and scores, etc.
* Guest - can only view matches and their details.

## Tech Stack:
Web server: NodeJS , ExpressJS , Mongoosejs , MongoDB

## Requirements
* Register Admin
* Login User
* Create Match
* Get Match Schedules
* Get Match Details
* Add a Team Member to a Squad
* Get Player Statistics

## Project Schema
* models: Database models (Admin.js , User.js...)
* pages: Contains the HTML files for different pages
* index.js: Handles HTTP requests (GET , POST)


## Deployment

To deploy this project run

```bash
  npm start
```



## Overview:
![Screenshot 2023-09-14 at 12 40 11 PM](https://github.com/pujjj/WorkIndia/assets/97466150/034aa58f-f427-4e0f-8f2b-7a9fea943b8b)

### MongoDB Tables:
![Screenshot 2023-09-14 at 2 30 36 PM](https://github.com/pujjj/WorkIndia/assets/97466150/773bf467-e3f5-4c11-a06c-122a88ae99ca)

### AddPlayer Table:
![Screenshot 2023-09-14 at 2 31 33 PM](https://github.com/pujjj/WorkIndia/assets/97466150/89722ef0-130e-4905-a1eb-cb530a2f61ae)
