Food Explorer
Food Explorer is a web application built using React, ReactFlow, and TypeScript, which allows users to explore meal categories, meals within those categories, and details such as ingredients, tags, and instructions for each meal. The project fetches meal data from the free API provided by TheMealDB.

Demo
You can check the live demo of the application on Netlify https://ayush-food-explorer.netlify.app/

Features
Explore different meal categories.
View meals within a category.
Fetch meal details, ingredients, and tags.
Interactive graph-based visualization of meal categories and meals.
Technologies Used
React.js: Frontend library for building user interfaces.
React Flow: Library for building node-based interfaces like flowcharts.
TypeScript: Superset of JavaScript for type safety.
Axios: Promise-based HTTP client for fetching API data.
CSS: For styling the UI components.
Installation
Prerequisites
Node.js and npm installed on your machine.
Steps
Clone the repository:

git clone https://github.com/ayush7078/food-explorer.git
cd food-explorer
Install dependencies:

npm install
Run the development server:

npm start
The app will run at http://localhost:3000/.

API
This project utilizes the free TheMealDB API to fetch meal categories and meal details.

Categories Endpoint: https://www.themealdb.com/api/json/v1/1/categories.php
Meals by Category Endpoint: https://www.themealdb.com/api/json/v1/1/filter.php?c={category}
Meal Details Endpoint: https://www.themealdb.com/api/json/v1/1/lookup.php?i={mealId}
Project Structure
/src
│
├── App.tsx         # Main React component
├── index.tsx       # Entry point of the app
├── App.css         # Styles for the app
Build and Deployment
Building the App for Production
To build the project for production:

npm run build
This will generate a build/ directory with all the necessary files to deploy.

Deploy to Netlify
Connect your repository to Netlify.
Set the Build command to npm run build.
Set the Publish directory to build.
Click "Deploy site" on Netlify, and your app will be live.
Contributing
Feel free to open issues or submit pull requests if you find any bugs or want to add new features.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
TheMealDB for the free meal API.
ReactFlow for the graph visualization.
