# Fullstack-Coursework1-Year3-M00978514
This is the frontend repository of the XLearning website that allows buying after school classes and activities.

## Required links for the web app
1. GitHub Repository for the Vue.js App: https://github.com/bteena04/Fullstack-Coursework1-Year3-M00978514.git 
2. Link to the GitHub Pages: https://bteena04.github.io/Fullstack-Coursework1-Year3-M00978514
3. GitHub Repository for the Express.js App: https://github.com/bteena04/Fullstack-Coursework1-Year3-ExpressApp-M00978514.git
4. Link to render.com route that returns all lessons (Express.js App): https://fullstack-coursework1-year3-expressapp.onrender.com/collections/lessons 

## Fullstack-Coursework1-Year3-M00978514/
│
├─ css/
├─ js/
│   ├─ main.js        # Main Vue.js logic
│   ├─ helper.js      # Shared helper functions
├─ images/            # Images for logo
├─ index.html
└─ README.md

## This website is deployed on render.com
To view the webpage, open https://bteena04.github.io/Fullstack-Coursework1-Year3-M00978514 in a browser.
> If the page returns a message like 'Sorry, the server is unavailable. Please try again later.', please wait up to 2 minutes or reload the page if the page is still not loaded after 2 minutes.

## How to run the Vue.js app locally
1. Clone the repository -> bash `git clone https://github.com/bteena04/Fullstack-Coursework1-Year3-M00978514.git`

2. Navigate into the project folder -> bash `cd Fullstack-Coursework1-Year3-M00978514`
3. Open index.html using live server.
    >Important: The frontend will only work correctly if the backend server is running and CORS allows your GitHub Pages domain.

## Features of the frontend.
### Display List of Lessons
>1. Shows at least 10 lessons
>2. Each with: subject, location, price, spaces, and an image
>3. Uses v-for to list items
>4. Lessons are stored in MongoDB

### Add to Cart & Remove from Cart
>1. Handles quantities
>2. Prevents adding more items than available spaces

### Place Order Functionality
>1. Validates required fields
>2. Sends a POST request using fetch + promises
>3. Shows success message

### Update Lesson Availability
>1. After placing an order, sends PUT requests to update available spaces
>2. Uses Promise.all() to handle multiple async updates

### Search Functionality
>1. Live search using backend route /lessons/search

### Sorting Functionality
>1. Sort by price, subject, location, description

## The frontend was fully and manually tested on the following areas:
1. Lesson list displays correctly
2. Items add/remove from cart
3. Order validation allows only correct input
4. Order placement works with live backend
5. Spaces update correctly after checkout
6. Searches return expected results


