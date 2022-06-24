# Update Pull Request Description

### Easily update a Pull Requests description with this GitHub Action

## Usage

Inside your `.github/workflows/workflow.yml` file:

```yaml
steps:
  - uses: AbbasMathiew/update-pr-description@main
    with:
      body: ${{ description }} # The text you wish to overwrite your Pull Request description with, can be a variable or a string
      token: ${{ secrets.GITHUB_TOKEN }}
      jiraBaseUrl: https://example.atlassian.net/browse
      jiraProjectKey: EXM
```

## Arguments

This action currently supports three inputs from the user: `body`, `token`, `jiraBaseUrl`, and `jiraProjectKey`. These inputs, along with their descriptions and usage contexts, are listed in the table below:

|  Input  |                                                 Description                                                 |   Usage    |
| :-----: | :---------------------------------------------------------------------------------------------------------: | :--------: |
| `body`  |                      The text you wish to overwrite your Pull Request description with                      | _Required_ |
| `token` | Your Github access token, which will already be available within your workflow without any additional setup | _Required_ |
| `jiraBaseUrl` | The Jira base url up until /ticket-number  | _Required_ |
| `jiraProjectKey` |  The jira project key, usually prefixing the ticket number example; EXM in EXM-123  | _Required_ |

## License

The code in this project is released under the [MIT](license).
