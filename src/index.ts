import { Property, SingleThing, Thing, Value, WebThingServer } from "webthing";
import { config } from "dotenv";
import { RefreshAction, updateThing } from "./refresh";
import {
  change,
  followers,
  follows,
  last,
  name,
  starred,
  status,
  total,
  username,
} from "./values";
config();

if (!process.env.HOURS) {
  console.error("HOURS environment variable is missing");
  process.exit(1);
}

if (!process.env.GITHUB_TOKEN) {
  console.error("GITHUB_TOKEN environment variable is missing");
  process.exit(1);
}

if (!process.env.USERNAME) {
  console.error("USERNAME environment variable is missing");
  process.exit(1);
}

function makeThing() {
  const thing = new Thing(
    `urn:dev:ops:github-stats-${process.env.USERNAME}`,
    "Github Stats of " + process.env.USERNAME,
    ["MultiLevelSensor"],
    "A thing that displays GitHub statistics"
  );

  thing.addProperty(
    new Property(thing, "lastFetched", last, {
      type: "string",
      title: "Last Fetched",
      description: "when the stats were last fetched",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "totalContributions", total, {
      title: "Total Contributions",
      type: "integer",
      description: "how many contributions the user has in the last year",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "username", username, {
      title: "Username",
      type: "string",
      description: "the username",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "name", name, {
      title: "Name",
      type: "string",
      description: "The full name of the person",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "followers", followers, {
      title: "Followers",
      type: "integer",
      description: "how many followers the user has",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "follows", follows, {
      title: "Follows",
      type: "integer",
      description: "how many people the user follows",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "starred", starred, {
      title: "Starred",
      type: "integer",
      description: "How many repositories the user has starred",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "lastChange", change, {
      title: "Last Update",
      type: "string",
      description: "when the user last updated his profile",
      readOnly: true,
    })
  );

  thing.addProperty(
    new Property(thing, "status", status, {
      title: "Status",
      type: "string",
      description: "the user's current status",
      readOnly: true,
    })
  );

  // thing.addAvailableEvent("overheated", {
  //   description: "The lamp has exceeded its safe operating temperature",
  //   type: "integer",
  //   unit: "degree celsius",
  // });

  thing.addAvailableAction(
    "refresh",
    {
      title: "refresh",
      description: "Refresh the stats manually",
    },
    RefreshAction
  );

  return thing;
}

function runServer() {
  const thing = makeThing();

  // If adding more than one thing, use MultipleThings() with a name.
  // In the single thing case, the thing's name will be broadcast.
  const server = new WebThingServer(new SingleThing(thing), 8888);

  process.on("SIGINT", () => {
    server
      .stop()
      .then(() => process.exit())
      .catch(() => process.exit());
  });
  updateThing(thing, true);

  server.start().catch(console.error);
}

runServer();
