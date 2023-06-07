# DevOps Exercise

## Pre-Requisites

Set up a Local Kubernetes Cluster 
    
Install Docker: Follow the installation guide for Docker based on your operating system: [Docker Installation Guide](https://docs.docker.com/get-docker/).

Install Kubernetes: Use a tool like `minikube` or `kind` to set up a local Kubernetes cluster. Choose one of the following options:

- Minikube: Follow the installation guide for Minikube: [Minikube Installation Guide](https://minikube.sigs.k8s.io/docs/start/).
- Kind: Follow the installation guide for Kind: [Kind Installation Guide](https://kind.sigs.k8s.io/docs/user/quick-start/).

# Exercise

## RESTful API

Implement a RESTful API that exposes an endpoint to check if a number is prime or not. The API should accept a POST request to the `/prime` endpoint and return a JSON response indicating whether the number is prime or not.

You may use any language that you want.

- Example Request

    ```json
    POST /prime
    {
    "number": 7
    }
    ```

- Example Response

    Prime Number
    ```json
    {
    "number": 7,
    "prime": true
    }
    ```

    Non-Prime Number
    ```json
    {
    "number": 4,
    "prime": false
    }
    ```

## ArgoCD & Deployment

Deploy the API built previously to the kubernetes cluster.

Use ArgoCD and GitOps principles to make this happen.

[ArgoCD Installation Guide](https://argoproj.github.io/argo-cd/getting_started/)

## Bonus Exercises

- Implement a CI/CD pipelines that builds, package, test and deploy the solution. You may use any CI/CD tool like GitHub, Gitlab, Buildkite, etc.
- Unit testing


# Submission

To complete the exercise, the candidate should provide the following:

- The code for all the solution that includes:
  - RESTful API code;
  - Dockerfiles;
  - ArgoCD app manifests;
  - Kubernetes deployment manifests.
- Any additional instructions or documentation that may be required to run or test the solution.
