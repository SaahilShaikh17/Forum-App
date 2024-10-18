terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>2.65.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~>2.15"  # Adjust the version as necessary
    }
  }

  required_version = ">= 0.14" # Specify the required Terraform version
}

# Azure Provider Configuration
provider "azurerm" {
  features {}
}

# Kubernetes Provider Configuration
provider "kubernetes" {
  config_path = "C:/Users/Saahil/.kube/config"  
}

# Resource Group
resource "azurerm_resource_group" "forum_rg" {
  name     = "forumResourceGroup"
  location = "Southeast Asia"
  tags = {
    Project = "ForumApp"
    Owner   = "Sanjana"
  }
}

# Azure Container Registry (ACR) to store Docker images
resource "azurerm_container_registry" "forum_acr" {
  name                = "forumacr12345"
  resource_group_name = azurerm_resource_group.forum_rg.name
  location            = azurerm_resource_group.forum_rg.location
  sku                 = "Basic" # Free-tier compatible
  admin_enabled       = true
}

# Azure Kubernetes Service (AKS)
resource "azurerm_kubernetes_cluster" "forum_aks" {
  name                = "forumAKSCluster"
  location            = azurerm_resource_group.forum_rg.location
  resource_group_name = azurerm_resource_group.forum_rg.name
  dns_prefix          = "forumapp"

  default_node_pool {
    name       = "default"
    node_count = 1               # Free tier typically allows one node for AKS
    vm_size    = "Standard_DS3_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
  }

  role_based_access_control {
    enabled = true
  }
}

# Storage Account for any static files or logs
resource "azurerm_storage_account" "forum_storage" {
  name                     = "forumappstorage"
  resource_group_name      = azurerm_resource_group.forum_rg.name
  location                 = azurerm_resource_group.forum_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Kubernetes Deployment for Backend
resource "kubernetes_deployment" "backend" {
  metadata {
    name = "backend-deployment"
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          image = "forumacr12345.azurecr.io/forum-server:latest"
          name  = "backend"

          env {
            name  = "DATABASE_URI"
            value = "mongodb+srv://saahils191:xnFT3FaE3lgn7HQG@forum-app-cluster.7et5d.mongodb.net/?retryWrites=true&w=majority&appName=forum-app-cluster"
          }

          env {
            name  = "ACCESS_TOKEN_SECRET"
            value = "65a067d64322d1c7716c68a67965c288b11c5aa5477d1bfa123f82d4fefade5f2065d035997ea634d4bcfd91f059240a02184d1b3eecb35625dadccbf3ea52cf"
          }

          env {
            name  = "REFRESH_TOKEN_SECRET"
            value = "b22d22203c23c28096c2848638a1614632c74d28c36254f3b6dda88d4108422590a9e85d5cb2126972a864497dff97bbbb399750920c6c60fe282a399df9a90b"
          }

          port {
            container_port = 5000
          }
        }
      }
    }
  }
}

# Kubernetes Service for Backend
resource "kubernetes_service" "backend" {
  metadata {
    name = "backend-service"
    labels = {
      app = "backend"
    }
  }

  spec {
    selector = {
      app = "backend"
    }

    type = "LoadBalancer"

    port {
      port        = 5000
      target_port = 5000
    }
  }
}

# Kubernetes Deployment for Frontend
resource "kubernetes_deployment" "frontend" {
  metadata {
    name = "frontend-deployment"
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          image = "forumacr12345.azurecr.io/forum-client:latest"
          name  = "frontend"
          port {
            container_port = 3000  # Corrected block type from ports to port
          }
        }
      }
    }
  }
}

# Kubernetes Service for Frontend
resource "kubernetes_service" "frontend" {
  metadata {
    name = "frontend-service"
    labels = {
      app = "frontend"
    }
  }

  spec {
    selector = {
      app = "frontend"
    }

    type = "LoadBalancer"

    port {
      port        = 80
      target_port = 3000
    }
  }
}
