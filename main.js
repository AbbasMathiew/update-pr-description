const core = require('@actions/core');
const github = require('@actions/github');

//TODO: think about preserving the current PR body, the input body and adding
//the jira, figma and other links
async function work() {
  try {
    //Init input values
    const token = core.getInput('token', { required: true });
    const body = core.getInput('body', { required: true });
    const jiraBaseUrl = core.getInput('jiraBaseUrl', { required: true });
    const jiraProjectKey = core.getInput('jiraProjectKey', { required: true })

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
    const [branchType, branchLabel] = branchName.split('/');

    //Split the branch label at '-' so we can extract the ticket number
    const branchLabelList = branchLabel.split('-');

    //Find the jiraProjectKey in the list, and the item after it should be the ticket number 
    const keyIndex = branchLabelList.indexOf(jiraProjectKey);
    const ticketNumber = branchLabelList[keyIndex + 1];

    //Concat the two values
    const projectKeyAndNumber = `${jiraProjectKey}-${ticketNumber}`

    //Create an intial template and the concat the provided body to it
    //TODO: add figma link
    const template = `
[Jira](${jiraBaseUrl}/${projectKeyAndNumber})

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






