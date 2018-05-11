# react-core-components

the project is deployed at [Heroku Deploy for react-core-components](https://react-core-components.herokuapp.com) visit.

## Development environment

### app

- `npm install`
- `npm run dev`
- [http://localhost:8080](http://localhost:8080)

### style guide

- `npm run styleguide`
- [http://0.0.0.0:3000](http://0.0.0.0:3000)

## Deployment

### Deployment with heroku
- Clone this repository to your github acount.
- Got to [Heroku Dashboard](https://dashboard.heroku.com/).
- Create a new app.
- Inside of this new app go to `Deploy` tab.
- Select GitHub as your Deployment method.
- Select the repository and the branch.
- Trigger the deploy at `Deploy Branch` at `Manual deploy` section.
- After deploy is complete open your app you should see the code there.

### Push code from local to heroku

- `heroku container:login`
- `heroku container:push web`
- `heroku open -a react-core-components`