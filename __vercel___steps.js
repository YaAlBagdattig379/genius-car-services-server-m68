/**
 *   //////  SET UP VERCEL  ///////
 *  1) create a vercel.json file and add all this code{
 *      {
    "version":2,
    "builds": [
        {
            "src": "index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
          "src": "/(.*)",
          "dest": "/"
        }
    ]
  }
 * }
    2) package.json er modde {
       "start": "node index.js",
         "build": "node index.js"} likhte hobe
 *  3) npm i -g vercel (run only for globally for your machine onetime)
 *  4) vercel --prod (after deploying project in vercel inside project you have to run this one to add rest of code)
 *  5) vercel website a new project a github theke add theke beche nite hobe 
 * backend server side 
 *   6) sekhane .env file set up koro nam er jagai nam an value er jaga value
 * 

 */