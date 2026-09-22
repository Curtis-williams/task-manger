# Task Manager

A simple task manager web app. Users can register, log in, and manage a personal list of tasks. Each task has a title, an optional description, and a completed status. Tasks are private to the account that created them.

## Deployed application

https://inspiring-centaur-baa9eb.netlify.app

## Demo video

https://youtu.be/rCa0XAu2jHc

## What it does

Users create an account with an email and password. Once logged in, they can add tasks, mark them complete, and delete them. Every task is tied to the account that created it, so one user never sees another user's tasks.

## Technologies used

* HTML, CSS, and vanilla JavaScript for the frontend
* Supabase for the database and user authentication
* Netlify for deployment
* Git and GitHub for version control

## Setup instructions

1. Clone this repository.
2. Create a free project at supabase.com.
3. In the Supabase SQL Editor, run the contents of schema.sql to create the tasks table and its security policies.
4. In your Supabase project settings, under API, copy your project URL and anon key.
5. Open config.js and paste those two values in place of the placeholders.
6. Open index.html in a browser, or deploy the folder to Netlify.

## Project structure

* index.html holds the page structure for the login screen and the task manager screen
* style.css holds all styling
* app.js handles authentication and all task CRUD operations through the Supabase client
* config.js holds the Supabase project URL and anon key
* schema.sql creates the tasks table and row level security policies in Supabase
