const core = require('@actions/core');
const github = require('@actions/github');


async function work() {
  try {
    //Init input values
    const token = core.getInput('token', { required: true });
    const body = core.getInput('body', { required: true });
    const jiraBaseUrl = core.getInput('jiraBaseUrl', { required: true });

    //Init other useful values
    const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split('/');
    const githubContext = github.context;
    const githubContextPayload = githubContext.payload;
    const prNum = githubContextPayload.pull_request.number;
    const octokit = github.getOctokit(token);


    //To get more details about the PR as the pull_request map in the context 
    //does not contain all the information
    const prInfo = await octokit.rest.pulls.get({
      owner: repoOwner,
      repo: repoName,
      pull_number: prNum,
    });

    //Get the branch name and split it 
    //on '/' char to get the ticket number
    const branchName = prInfo.data.head.ref;
    const [branchType, ticketNumber] = branchName.split('/');

    //Create an intial template and the concat the provided body to it
    //TODO: add figma link
    const template = `
[Jira](${jiraBaseUrl}/${ticketNumber})

---

`;

    const finalBody = template.concat(body);
    console.log(finalBody);

    //Update the pull request
    octokit.rest.pulls.update({
      owner: repoOwner,
      repo: repoName,
      body: finalBody,
      pull_number: prNum,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

work()






