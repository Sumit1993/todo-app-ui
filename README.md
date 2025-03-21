# Next.js App

This is a Next.js application that consumes the [DummyJSON Todos API](https://dummyjson.com/docs/todos). It is deployed locally using Kubernetes with Rancher Desktop, DevSpace, and Helm.

## Features
- Built with **Next.js App Router**
- Uses **@tanstack/react-query** for data fetching
- Integrated with **Prometheus** for monitoring
- Runs in a **Kubernetes** cluster managed via **Rancher Desktop**
- Deployment managed using **DevSpace** and **Helm**

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Rancher Desktop](https://rancherdesktop.io/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/)
- [DevSpace](https://devspace.sh/)

## Getting Started

### Install Dependencies
```
cd todo-app-ui
npm install
```

### Run Locally
```
npm run dev
```

### Deploy to Local Kubernetes (with DevSpace)
```
cd todo-app-ui
devspace dev
```

### Access the Application
Once deployed, the application is accessible via the Nginx Ingress Controller at:

```
http://localhost/
```

## Monitoring
This application is monitored via Prometheus, which collects performance metrics from the Next.js app.

## Development Notes
- The application runs in **Kubernetes** using **DevSpace**.
- Ingress is managed via **NGINX**.
- Observability is handled via **Prometheus**.
