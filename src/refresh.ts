import { Action, Thing } from "webthing";
import { v4 as uuidv4 } from "uuid";
import { graphql } from "@octokit/graphql";
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

const hours = Number(process.env.HOURS);
const UPDATE_INTERVAL = 1000 * 60 * 60 * hours;

export class RefreshAction extends Action {
  constructor(thing: Thing, input: any) {
    super(uuidv4(), thing, "refresh", input);
  }

  async performAction() {
    await updateThing(this.getThing(), false);
  }
}

interface User {
  name: string;
  login: string;
  status: {
    message: string;
  };
  starredRepositories: {
    totalCount: number;
  };
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
  };
  updatedAt: string;
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
    };
  };
}
/**
 * updates the single thing with the information from github's graphql API
 */
export async function updateThing(thing: Thing, startTimeout: boolean) {
  console.log(new Date().toISOString(), "fetching github stats");

  const { user: userRes } = await graphql(
    `
      {
        user(login: "${process.env.USERNAME}") {
          name
          login
          status {
            message
          }
          starredRepositories {
            totalCount
          }
          followers {
            totalCount
          }
          following {
            totalCount
          }
          updatedAt
          repositories {
            totalCount
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  const user: User = userRes;
  last.notifyOfExternalUpdate(new Date().toISOString());
  total.notifyOfExternalUpdate(
    user.contributionsCollection.contributionCalendar.totalContributions
  );
  username.notifyOfExternalUpdate(user.login);
  name.notifyOfExternalUpdate(user.name);
  followers.notifyOfExternalUpdate(user.followers.totalCount);
  follows.notifyOfExternalUpdate(user.following.totalCount);
  starred.notifyOfExternalUpdate(user.starredRepositories.totalCount);
  change.notifyOfExternalUpdate(user.updatedAt);
  status.notifyOfExternalUpdate(user.status.message);

  startTimeout && setTimeout(() => updateThing(thing, true), UPDATE_INTERVAL);
  console.log(
    new Date().toISOString(),
    `will fetch stats again in ${hours} hours`
  );
}
