# "SaferCity" app Backend

Allows to store and retrieve data for "SaferCity" app.

## API
[Specification on swagger](https://app.swaggerhub.com/apis/safercity/SaferCityBackend/1.0.0)

## Setup
Checkout the code then run:

```bash
npm install
```

To start the app:

```bash
npm run dev
```

Note that this will launch ["nodemon"](https://github.com/remy/nodemon#nodemon)
that will listen to any changes in source code and automatically restart the applicaiton.

To test:

```bash
npm test
```

## Development
While working on code please always create a new branch
(all pushes to master are forbidden)

## Deployment
To deploy app to staging merge PR to master branch.
CI will test your changes and if everything is ok it'll
automatically deploy your changes to staging
