import * as path from 'path';
import { promises as fs } from 'fs';
import { exec } from '@actions/exec';
import * as github from '@actions/github';
import * as core from '@actions/core';
import axios from 'axios';
import semver from 'semver';

let githubToken = process.env.GITHUB_TOKEN;

const relativePath = (...paths) => path.join(process.cwd(), ...paths);
const readJson = (filePath) => {
  return JSON.parse(fs.readFile(relativePath(filePath), 'utf-8'));
};

(async () => {
  if (!githubToken) {
    core.setFailed('Please add the GITHUB_TOKEN to the changesets action');
    return;
  }

  let currentFeather = readJson('node_modules/feather-icons/package.json');

  let { data: feather } = await axios.get(
    'https://unpkg.com/feather-icons/package.json',
  );

  let diff = semver.diff(currentFeather.version, feather.version);
  switch (diff) {
    case 'patch':
    case 'premajor':
    case 'preminor':
    case 'prepatch':
    case 'prerelease':
      console.log('Patch or prerelease found. Ignoring.');
      return;
    case null:
      console.log('No version bump detected. Ignoring.');
      return;
    default:
  }

  let repo = `${github.context.repo.owner}/${github.context.repo.repo}`;
  let branch = `feather-icons/${feather.version}`;
  let octokit = github.getOctokit(githubToken);

  let searchQuery = `repo:${repo}+state:open+head:${branch}+base:main`;
  let searchResult = await octokit.search.issuesAndPullRequests({
    q: searchQuery,
  });

  if (searchResult.data.items.length === 0) {
    console.log('PR already up. Ignoring.');
  }

  console.log('Feather icons bumped, initiating version bump');

  await exec('git', [
    'config',
    '--global',
    'user.name',
    `"github-actions[bot]"`,
  ]);

  await exec('git', [
    'config',
    '--global',
    'user.email',
    `"github-actions[bot]@users.noreply.github.com"`,
  ]);

  await exec('git', ['checkout', '-b', branch]);

  await exec('yarn', ['add', '--dev', 'feather-icons', '@types/feather-icons']);

  let changeset = `
---
'@fransvilhelm/feather': ${diff}
---

Bump feather-icons to version ${feather.version}.
`;
  await fs.writeFile(
    relativePath('.changeset/feather.md'),
    changeset.trim() + '\n',
  );

  await exec('git', ['add', '.']);
  await exec('git', [
    'commit',
    '-m',
    `Bump feather icons to version ${feather.version}`,
    '--no-verify',
  ]);

  await exec('git', ['push', 'origin', `HEAD:${branch}`, '--force']);

  await octokit.pulls.create({
    base: 'main',
    head: branch,
    title: `Bump feather-icons to version ${feather.version}`,
    body: `Bump feather icons to version ${feather.version}`,
    ...github.context.repo,
  });
})();
