# Lesson 6: CI/CD for .NET

When working on modern software teams or maintaining production applications, building your code, running unit tests, and deploying updates manually is highly inefficient. If a developer forgets to run the test suite before deploying, bugs can slip into production.

**CI/CD** solves this by automating the entire pipeline from the moment you commit code to a repository to the moment it runs live on a server.

---

## 1. What is CI/CD?

CI/CD breaks down into two distinct automated phases that work together to form a seamless software delivery pipeline:

* **Continuous Integration (CI):** Focuses on code quality. Every time a developer pushes code to a shared repository (like GitHub or Azure DevOps), an automated server pulls the code, compiles it, and runs the entire unit test suite. If the code fails to compile or a test breaks, the team is notified immediately.
* **Continuous Delivery / Deployment (CD):** Focuses on automation. Once the CI phase successfully builds and verifies the code, the CD phase automatically packages the compiled application and deploys it to a hosting environment (like Azure App Service, Docker containers, or an on-premises server).

---

## 2. Core Concepts: Actions, Runners, and Pipelines

Automated pipelines are written as code files—typically using **YAML** (`.yml`) syntax—and live directly inside your project repository.

* **Pipeline / Workflow:** The entire automation plan containing a sequence of automated steps.
* **Runner / Agent:** The virtual machine execution environment provided by the platform (e.g., a clean Ubuntu or Windows server) that temporarily boots up to execute your script commands.
* **Jobs and Steps:** A pipeline is broken down into sequential jobs (e.g., Build Job, Test Job, Deploy Job). Each job contains granular command lines or pre-built scripts (Steps).

---

## 3. A Practical GitHub Actions Pipeline for .NET

GitHub Actions is one of the most widely used platforms for .NET CI/CD. To create a pipeline, you create a file at `.github/workflows/dotnet-ci-cd.yml` in your repository.

Here is a standard production-ready YAML pipeline that automatically builds and tests a .NET application every time code is pushed to the `main` branch:

```yaml
# The name of the automation workflow
name: .NET Core CI-CD Pipeline

# 1. Define the trigger events
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

# 2. Define the execution jobs
jobs:
  build-and-test:
    # Use a clean virtual machine hosted by GitHub
    runs-on: ubuntu-latest

    steps:
    # Step 1: Pull the code from the repository into the runner environment
    - name: Checkout Code
      uses: actions/checkout@v4

    # Step 2: Install the requested .NET SDK on the virtual machine
    - name: Setup .NET SDK
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: '8.0.x' # Target your project framework version

    # Step 3: Download and restore NuGet package dependencies
    - name: Restore Dependencies
      run: dotnet restore

    # Step 4: Compile the application code in Release mode
    - name: Build Application
      run: dotnet build --no-restore --configuration Release

    # Step 5: Execute the automated unit test suite
    - name: Run Unit Tests
      run: dotnet test --no-build --verbosity normal

```

---

## 4. Expanding into Continuous Deployment (CD)

Once your tests pass successfully within the CI job step, you can append deployment steps to pass the compiled production binaries straight to a cloud environment like **Azure App Service**.

Instead of typing credentials directly into your YAML file, you store them securely inside **GitHub Secrets** as encrypted variables.

```yaml
    # This step would append right after your testing step in a CD pipeline
    - name: Publish Binaries
      run: dotnet publish -c Release -o ./publish

    - name: Deploy to Azure App Service
      uses: azure/webapps-deploy@v3
      with:
        app-name: 'my-production-api' # Name of your Azure App Service web app
        publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }} # Encrypted secure token
        package: ./publish

```

---

## 5. Summary Benefits of CI/CD

| Manual Deployment Risks | CI/CD Automated Benefits |
| --- | --- |
| **"It works on my machine":** Code relies on local configurations or folders missing on the server. | **Clean-Room Verification:** Code is validated inside an isolated, vanilla server environment ensuring complete portable environment matching. |
| **Undetected Regressions:** Human error skips running specific test suites before pushing changes. | **Enforced Quality Gates:** Code cannot physical advance or deploy to production if a single unit test breaks. |
| **Fragile Deployments:** Manually copying files via FTP or command lines easily introduces version mismatches. | **Immutable Releases:** Repeatable, predictable deployments backed by automated history tracking logs. |