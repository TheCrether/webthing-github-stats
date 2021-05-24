# webthing-github-stats

This is a project for one of my classes.

It uses the WebThings framework to display GitHub statistics as a WebThing thing.

## Configuration

```env
GITHUB_TOKEN=<GITHUB_TOKEN>
HOURS=6
USERNAME=TheCrether
PORT=8888
```

You need to replace `<GITHUB_TOKEN>` with a Personal Access Token you create on GitHub. The HOURS variable handles the refresh interval (in hours). USERNAME is used to configure the user which will be fetched. PORT is used to specify on which Port the WebThing handler should start on. This gets put into a `.env` file at the root of the project directory (not inside the `src` directory).

## Startup

If you haven't already installed the dependencies, install them now with `npm install`

To finally start the WebThing, you just need to type in `npm start` and off you go!
