import os
import sys
import requests
import json

# GitHub Configuration
GITHUB_PAT = os.getenv("GITHUB_PAT")  # GitHub token from environment variable
OWNER = "jessewashburn"  # GitHub username
REPO = "HabitQuest"  # GitHub repository name

# API URL for various GitHub operations
API_URL = f"https://api.github.com/repos/{OWNER}/{REPO}"

# Authentication header for GitHub API
HEADERS = {
    "Authorization": f"Bearer {GITHUB_PAT}",
    "Content-Type": "application/json"
}

# Function to create a GitHub issue
def create_github_issue(title, body):
    """Create a GitHub issue using GitHub API."""
    url = f"{API_URL}/issues"
    payload = {
        "title": title,
        "body": body
    }
    response = requests.post(url, headers=HEADERS, data=json.dumps(payload))
    if response.status_code == 201:
        print(f"Issue created: {response.json()['html_url']}")
    else:
        print(f"Failed to create issue: {response.status_code}")
        print(response.text)

# Function to create a GitHub pull request
def create_pull_request(title, body, head, base):
    """Create a GitHub pull request using GitHub API."""
    url = f"{API_URL}/pulls"
    payload = {
        "title": title,
        "body": body,
        "head": head,  # The branch where the changes are
        "base": base  # The branch to merge into (usually "main")
    }
    response = requests.post(url, headers=HEADERS, data=json.dumps(payload))
    if response.status_code == 201:
        print(f"Pull request created: {response.json()['html_url']}")
    else:
        print(f"Failed to create pull request: {response.status_code}")
        print(response.text)

# Function to list all GitHub issues
def list_issues():
    """List all GitHub issues using GitHub API."""
    url = f"{API_URL}/issues"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        issues = response.json()
        if issues:
            print("Issues:")
            for issue in issues:
                print(f"- {issue['title']} (#{issue['number']}) - {issue['state']}")
        else:
            print("No issues found.")
    else:
        print(f"Failed to fetch issues: {response.status_code}")
        print(response.text)

# Available GitHub Actions (commands)
ACTIONS = {
    'create_issue': 'Creates a GitHub issue',
    'update_issue': 'Updates an existing GitHub issue',
    'create_pr': 'Creates a GitHub pull request',
    'merge_pr': 'Merges a GitHub pull request',
    'list_prs': 'Lists GitHub pull requests',
    'list_issues': 'Lists GitHub issues',
    'comment_on_issue': 'Comments on a GitHub issue',
    'list_branches': 'Lists branches in a repository'
}

# Function to execute an action based on the input from the user
def run_action(action, *args):
    """Execute the action requested by the user."""
    if action == 'create_issue':
        title = args[0]
        body = args[1]
        create_github_issue(title, body)
    elif action == 'create_pr':
        title = args[0]
        body = args[1]
        head = args[2]
        base = args[3]
        create_pull_request(title, body, head, base)
    elif action == 'list_issues':
        list_issues()

# Main execution
def main():
    if len(sys.argv) < 2:
        print("Usage: python github_mcp_tools.py <action> [arguments...]")
        sys.exit(1)

    action = sys.argv[1]

    # Execute the action based on user input
    if action == 'generate_command':
        prompt = sys.argv[2] if len(sys.argv) > 2 else "Create a GitHub issue."
        print("Generated Command:", prompt)
    elif action in ACTIONS:
        args = sys.argv[2:]
        run_action(action, *args)
    else:
        print(f"Unknown command: {action}")
        sys.exit(1)

# Example usage (will now use command-line arguments to get the title and body)
if __name__ == "__main__":
    main()

