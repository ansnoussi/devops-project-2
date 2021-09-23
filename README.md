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

- deploy the app

```
kubectl apply -f k8s/deploy-to-kubernetes.yaml
```

- verify that config.js has been replaced:

```bash
#first export list the pod holding our application
export MY_POD=`kubectl get pods | grep multi-stage-react-app-example | cut -f1 -d ' '`

# connect to shell in alpine image
kubectl exec -it $MY_POD -- /bin/sh

# display content of the config.js file
less /usr/share/nginx/html/config.js
```

- access the deployed app :
  1- with port forwarding `kubectl port-forward svc/multi-stage-react-app-example 3001:80`
  2- if using minikube : `minikube service --url multi-stage-react-app-example`

- to delete the app :

```
kubectl delete -f k8s/deploy-to-kubernetes.yaml
```

## Kustomize

Kustomize is a standalone tool to customize Kubernetes objects through a kustomization file.
With Kustomize you define base resources in the so called bases (cross cutting concerns available in environments) and in the overlays the properties that are specific for the different deployments.
We will use Kustomize to change the number of replicas to 2 in prod.

- check the generated resources before deploying

```
kubectl kustomize kustomize/overlays/dev
```

- apply the generated dev app

```
kubectl apply -k kustomize/overlays/dev
```

- delete the dev app

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

- to execute a dry-run to see the generated resources from the chart

```
helm install -n local-release helm-chart/ --dry-run --generate-name
```

- to deploy the chart

```
helm install helm-chart/ --generate-name
```

- deploy with dev values

```
helm upgrade dev-release ./helm-chart/ --install --force --values helm-chart/config-values/config-dev.yaml
```

- delete the dev release

```
helm delete --purge dev-release
```

- to list the installed charts

```
helm list
```

- to delete the chart

```
helm delete <chart_name_from_previous_command>
```
