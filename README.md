#react-core-components

the project is running under [Heroku Deploy for react-core-components](https://react-core-components.herokuapp.com)

##Run

`npm install`
`npm run dev`

http://localhost:8080/


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

## Push code from local to heroku

- `heroku container:login`
- `heroku container:push web`
- `heroku open -a react-core-components`