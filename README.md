# devops-project-2

deploy a React app to k8s in a multi-environment setup (kubectl, helm, kustomize, skaffold)

## Docker Image

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

- deploy the app

```
kubectl apply -f k8s/deploy-to-kubernetes.yaml
```

- access the deployed app :
  1- with port forwarding `kubectl port-forward svc/multi-stage-react-app-example 3001:80`
  2- if using minikube : `minikube service --url multi-stage-react-app-example`

- to delete the app :

```
kubectl delete -f k8s/deploy-to-kubernetes.yaml
```
