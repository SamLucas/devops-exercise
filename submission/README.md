# Submission DevOps Exercise

The complete api code is in the api folder, it was developed with TypeScript and Node.js

## How to use

  - ## Kubernetes

    Before starting it is necessary to have a kubernetes cluster, you can use minkube to help you with this. In addition, you need to install kubectl to be able to run some commands on the cluster. Start preparations using the [documentation](https://kubernetes.io/docs/tasks/tools/)

    With the tools installed, you are ready to install and configure argocd

    - ### Install ArgoCD

      you can install using:

      ```sh
      kubectl create namespace argocd
      kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
      ```

      after the service is completely installed, you can get the facade password:

      ```sh
      argocd admin initial-password -n argocd
      ```
      To install the ArgoCD CLI, follow this [documentation](https://argo-cd.readthedocs.io/en/stable/cli_installation/). on linux, for example, you can use:


      ```sh
      curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
      sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
      rm argocd-linux-amd64
      ```
    - ### Configuring Argocd in Minikube

      after installing, do port-forward:

      ```sh
      k port-forward -n argocd svc/argocd-server 8080:443
      ```

      recover admin password:

      ```sh
      argocd admin initial-password -n argocd
      ```

      then login with the argocd cli:

      ```sh
      argocd login localhost:8080
      ```

      get the cluster context with kubectl:

      ```sh
      k config current-context
      ```

      and add the context in argocd with:

      ```sh
      argocd cluster add <CONTEXT>
      ```

      you can check if the context was added by doing:

      ```sh
      argocd cluster list
      ```

    - ## Install App in Minkube with Argo

      
      > **_NOTE:_**  Do you can get URL_ARGO_CLUSTER executing this: 
      > ```sh
      > argocd cluster list
      > ```


      ### Using ArgoCD CLI

      create namespace:

      ```sh
      kubectl create namespace api-altbank
      ```

      install app:

      ```sh
      argocd app create api-altbank --path k8s \
      --repo https://gitlab.com/sldanke93/api-altbank.git \
      --dest-server URL_ARGO_CLUSTER \
      --dest-namespace api-altbank
      ```

      just access the ```api-altbank-svc``` service url by running:

      ```sh
      minikube service list 
      ```

      ### Using ArgoCD Manifest
      
      create namespace:

      ```sh
      kubectl create namespace api-altbank
      ```

      To install the API with Argocd you can use this manifest ( [```api/argocd.yml```](./api/argocd.yml) ):

      ```sh 
      kubectl apply -f api/argocd.yml
      ```

      ```yaml
      # /api/argocd.yml
      
      apiVersion: argoproj.io/v1alpha1
      kind: Application
      metadata:
        name: api-altbank
        namespace: argocd
      spec:
        destination:
          namespace: api-altbank
          server: URL_ARGO_CLUSTER
        source:
          path: k8s
          repoURL: "https://gitlab.com/sldanke93/api-altbank.git"
          targetRevision: HEAD
        sources: []
        project: default

      ```

      just access the ```api-altbank-svc``` service url by running:

      ```sh
      minikube service list 
      ```
      
      Installing with argocd will install the following [objects](./api/k8s/) inside kubernetes:

      ```yaml
      # api/k8s/deployment.yml

      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: api-altbank
        namespace: api-altbank
      spec:
        replicas: 1
        selector:
          matchLabels:
            app: api-altbank
        template:
          metadata:
            labels:
              app: api-altbank
          spec:
            containers:
              - name: api-altbank
                image: registry.gitlab.com/sldanke93/api-altbank
                imagePullPolicy: Always
                ports:
                  - containerPort: 8080
                    protocol: TCP
                    name: web
                env:
                  - name: MORGAN_TYPE
                    value: prod
                  - name: API_PORT
                    value: "8080"
                readinessProbe:
                  failureThreshold: 3
                  httpGet:
                    path: /status
                    port: 8080
                    scheme: HTTP
                  initialDelaySeconds: 10
                  periodSeconds: 10
                  successThreshold: 1
                  timeoutSeconds: 1
      ```
      ```yaml
      # api/k8s/service.yml

      apiVersion: v1
      kind: Service
      metadata:
        name: api-altbank-svc
        namespace: api-altbank
      spec:
        type: LoadBalancer
        ports:
          - name: http
            port: 80
            targetPort: 8080
            protocol: TCP
        selector:
          app: api-altbank
      ```

      Notes: If this api was published on a k8s with nginx-ingress or a traefik, you can use the file [all_manifest.yaml](./api/all_manifest.yaml)



  - ## Docker 

    In a local environment, with only docker you can use the dockerfile (build) to create the image

    ```sh
    docker build -t api-altbank .
    ```

    You can run the application by creating the image:

    ```sh
    docker run -d -p 8080:8080 api-altbank 
    ```

    just access the:

    ```sh
    http://localhost:8080/status
    ```

    - ### Dockerfiles

      To create an api image, just use this dockerfile:

      ```dockerfile
      # Dockerfile(Build)

      FROM node:16.20.0-alpine AS build

      COPY . .

      RUN yarn && yarn build

      FROM node:16.20.0-alpine

      WORKDIR /home

      ENV MORGAN_TYPE prod
      ENV API_PORT 8080

      COPY --from=build build /home/build
      COPY --from=build node_modules /home/node_modules

      EXPOSE 8080

      CMD ["node","build/server.js"]
      ```

      To build an image from a pipeline, the dockerfile to be used will be this:

      ```dockerfile
      # Dockerfile(Pipeline)

      FROM node:16.20.0-alpine

      WORKDIR /home

      ENV MORGAN_TYPE prod
      ENV API_PORT 8080

      COPY build /home/build
      COPY node_modules /home/node_modules

      EXPOSE 8080

      CMD ["node","build/server.js"]
      ```

      The build of this project along with its libs will be generated from the pipeline. The two files are inside the api folder.

      ## CI/CD

      This is a gitlab-ci pipeline, it is responsible for running the tests, building the application and creating a public docker image.

      ```yml

      stages:
        - test
        - build
        - docker

      cache:
        paths:
          - node_modules/

      test:javascript:
        stage: test
        image: node:lts-slim
        coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
        before_script:
          - yarn install --dev-dependencies
        script:
          - yarn test
        artifacts:
          paths:
            - coverage/lcov.info
            - coverage/lcov-report
          expire_in: 1h

      build:javascript:
        stage: build
        image: node:lts-slim
        cache:
          paths:
            - node_modules
        before_script:
          - yarn --prod --frozen-lock
        script:
          - yarn build
        artifacts:
          paths:
            - build
          expire_in: 1h

      docker:
        stage: docker
        image:
          name: gcr.io/kaniko-project/executor:debug
          entrypoint: [""]
        script:
          - mkdir -p /kaniko/.docker
          - echo "{\"auths\":{\"${CI_REGISTRY}\":{\"auth\":\"$(printf "%s:%s" "${CI_REGISTRY_USER}" "${CI_REGISTRY_PASSWORD}" | base64 | tr -d '\n')\"}}}" > /kaniko/.docker/config.json
          - >-
            /kaniko/executor
            --context "${CI_PROJECT_DIR}"
            --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
            --destination "${CI_REGISTRY_IMAGE}:${CI_COMMIT_TAG}"
      ```

      Notes: You can check your execution by clicking [here](https://gitlab.com/sldanke93/api-altbank/-/pipelines)