# devops-project-2

deploy a React app to k8s in a multi-environment setup (kubectl, helm, kustomize, skaffold)

## Docker

- To build the docker image

```
docker build --tag multi-stage-react-app-example:latest .
```

- To run in Docker

```
docker run -p 3001:80 multi-stage-react-app-example:latest
```

- Push to a container registry (Docker hub in this case)

```
docker tag multi-stage-react-app-example anissnoussi/multi-stage-react-app-example:latest
docker push anissnoussi/multi-stage-react-app-example:latest

```

## Kubernetes

- Create a configMap on the fly:

  - For dev

  ```
  kubectl create configmap multi-stage-react-app-example-config --from-file=config.js=env/dev.properties
  ```

  - For prod

  ```
  kubectl create configmap multi-stage-react-app-example-config --from-file=config.js=env/prod.properties
  ```

- Deploy the app

```
kubectl apply -f k8s/deploy-to-kubernetes.yaml
```

- Verify that config.js has been replaced:

```bash
#first export list the pod holding our application
export MY_POD=`kubectl get pods | grep multi-stage-react-app-example | cut -f1 -d ' '`

# connect to shell in alpine image
kubectl exec -it $MY_POD -- /bin/sh

# display content of the config.js file
less /usr/share/nginx/html/config.js
```

- Access the deployed app :
  1- with port forwarding `kubectl port-forward svc/multi-stage-react-app-example 3001:80`
  2- if using minikube : `minikube service --url multi-stage-react-app-example`

- To delete the app :

```
kubectl delete -f k8s/deploy-to-kubernetes.yaml
```

## Kustomize

Kustomize is a standalone tool to customize Kubernetes objects through a kustomization file.
With Kustomize you define base resources in the so called bases (cross cutting concerns available in environments) and in the overlays the properties that are specific for the different deployments.
We will use Kustomize to change the number of replicas to 2 in prod.

- Check the generated resources before deploying

```
kubectl kustomize kustomize/overlays/dev
```

- Apply the generated dev app

```
kubectl apply -k kustomize/overlays/dev
```

- Delete the dev app

```
kubectl delete -k kustomize/overlays/dev
```

## Helm

Helm is a tool that streamlines installing and managing Kubernetes applications. Think of it like apt/yum/homebrew for Kubernetes.

- To create a basic Helm chart template

```
helm create helm-chart
```

- To lint the Helm chart

```
helm lint helm-chart
```

- To execute a dry-run to see the generated resources from the chart

```
helm install -n local-release helm-chart/ --dry-run --generate-name
```

- To deploy the chart

```
helm install helm-chart/ --generate-name
```

- Deploy with dev values

```
helm upgrade dev-release ./helm-chart/ --install --force --values helm-chart/config-values/config-dev.yaml
```

- Delete the dev release

```
helm delete --purge dev-release
```

- To list the installed charts

```
helm list
```

- To delete the chart

```
helm delete <chart_name_from_previous_command>
```

## Skaffold

Skaffold is a command line tool that facilitates continuous development for Kubernetes applications. You can iterate on your application source code locally then deploy to local or remote Kubernetes clusters. Skaffold handles the workflow for building, pushing and deploying your application. It also provides building blocks and describe customizations for a CI/CD pipeline.
The configuration for Skaffold in defined in the skaffold.yaml file in the root directory of the project.

- To run Skaffold (the --tail option tails the logs in the container)

```
skaffold run --tail
```

- Delete local deployment with Skaffold

```
skaffold delete
```

The `skaffold run` command, standard mode, instructs Skaffold to build and deploy your application **exactly once**.

running `skaffold dev` will enables the monitoring of the source repository, so that every time you make changes to the source code, Skaffold will build and deploy your application.

you can also specify the `--port-forward`, which will port forward your service to a port chosen by Skaffold.

- Run in dev mode

```
skaffold dev --port-forward
```

- Deploy to other environment with Skaffold profiles (defined in the profiles section in `skaffold.yaml`)

```
skaffold run -p kustomize-prod
```

- To delete the new enviroment

```
skaffold delete -p kustomize-prod
```
