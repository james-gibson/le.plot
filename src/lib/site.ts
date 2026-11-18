/**
 * Where this site lives, and the seed it was grown from.
 *
 * One file, because every one of these strings appears in at least two places:
 * the canonical link, the footer, the agent handoff payload, the build's
 * `llms.txt`, and the map's own rows. A duplicated origin is a broken deploy
 * that only shows up on the deployed site.
 */

export const SITE = 'le.plot'

/** The deployed origin, without a trailing slash. */
export const ORIGIN = 'https://james-gibson.github.io/le.plot'

export const REPO_URL = 'https://github.com/james-gibson/le.plot'

/** The starter this site was cloned from. Its own row in the map is this constant. */
export const PARENT = {
  name: 'le.gume',
  origin: 'https://james-gibson.github.io/le.gume',
  repo: 'https://github.com/james-gibson/le.gume',
}

/** The shortest payload that still tells an agent where the contract is. */
export const HANDOFF =
  'Read https://james-gibson.github.io/le.plot/llms.txt — publish by pushing to main; the deploy workflow builds. Repo: https://github.com/james-gibson/le.plot'
