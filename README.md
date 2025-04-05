# DevTinder

## For Development - Branching & PR Workflow
* **NAMING CONVENTION**
  * For **features**:
    * Use the `feature-` prefix.
    * Example: feature-login, feature-user-auth
  * For **bug fixes**:
    * Use the `hotfix-` prefix.
    * Example: hotfix-crash-on-submit, hotfix-ui-glitch

* `main`, `readme`, and **any branch** starting with `feature-` or `hotfix-` are protected — you **cannot commit or push directly** to these branches due to **branch protection rules**.

* To **push the changes**:- 
  * Check out that remote branch locally.
  * Create a local child branch from the remote branch to make your changes.
  * Raise a PR from the local child branch to the remote parent branch (base).
  * Once the PR is approved, it can be merged.
