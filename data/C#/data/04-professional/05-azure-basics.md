# Lesson 5: Azure Basics

When building enterprise applications, APIs, or modern web apps, you need servers to host them. Traditionally, companies had to purchase expensive physical servers, configure massive networking systems, and maintain temperature-controlled server rooms.

**Microsoft Azure** is a **Cloud Computing Platform** that replaces physical infrastructure with virtualized resources over the internet. Instead of owning hardware, you rent computing power, storage, and databases from Microsoft's global data centers on a **pay-as-you-go** pricing model.

---

## 1. Cloud Architecture Models

Cloud computing structures its resource management into three core service layers, shifting responsibilities cleanly between you and Microsoft:

* **IaaS (Infrastructure as a Service):** You rent raw virtualized hardware (Virtual Machines, Storage). You are completely responsible for configuring the operating system, installing runtimes, and managing updates.
* **PaaS (Platform as a Service):** Microsoft handles the hardware, infrastructure, and operating system updates automatically. They present a clean platform where you simply upload your application code.
* **SaaS (Software as a Service):** A fully functional, end-user application running on the web (e.g., Microsoft 365, GitHub).

---

## 2. Core Azure Concepts

To organize and secure cloud architectures efficiently, Azure relies on a strict organizational hierarchy:

* **Geographies & Regions:** A **Region** is a specific geographical area containing a cluster of secure data centers linked by a high-speed fiber network (e.g., *East US*, *West Europe*, *Central India*). Deploying your app in a region physically close to your target users minimizes network latency.
* **Resource Groups:** A logical container where your Azure resources (web apps, databases, storage accounts) are grouped together. This lets you deploy, monitor, and delete an entire project infrastructure cleanly as a single unit.
* **Azure Resource Manager (ARM):** The underlying deployment management engine that creates, updates, and deletes resources inside your Azure subscription.

---

## 3. Essential Azure Services for .NET Developers

Azure offers hundreds of services, but modern full-stack backend development relies heavily on a core suite:

### Computing: Azure App Service (PaaS)

Instead of renting a Virtual Machine and configuring a Linux firewall or web server yourself, **Azure App Service** allows you to deploy an ASP.NET Core API or Blazor web app directly. It handles scaling up automatically when your web traffic surges.

### Storage: Azure Blob Storage

A highly scalable, fast object storage service designed to hold massive amounts of unstructured data. It is ideal for storing user-uploaded media files, documents, backups, or raw log data outside of your application's server memory.

### Databases: Azure SQL Database (PaaS)

A fully managed relational cloud database built on the Microsoft SQL Server engine. Azure manages automated backups, software security patching, and scaling constraints, allowing you to link your Entity Framework Core context straight to a production cloud database cleanly.

---

## 4. App Service Deployment Strategies

Getting your application code safely onto an active Azure host environment can be achieved through multiple paths:

* **Direct ZIP / Git Deployment:** Uploading compiled binaries from a local directory or syncing an active repository stream directly to the web app dashboard configurations.
* **Containerized Deployment:** Packing your application into a **Docker Container** and publishing it to **Azure Container Registry (ACR)**. App Service can then pull the image and run it identically regardless of underlying cloud configurations.
* **CI/CD Pipelines:** Automatically triggering compilation, unit tests, and cloud deployments through **GitHub Actions** or **Azure DevOps Pipelines** every single time you push code modifications to a `main` branch.

---

## 5. Connecting a .NET App to Azure Safely

When an application connects to a cloud service (like an Azure SQL database or Blob Storage), it requires access credentials. Hardcoding database connection strings directly into an `appsettings.json` file creates a massive security vulnerability if that code is ever committed to public repositories.

### The Modern Standard: Managed Identities

Modern Azure application design completely eliminates connection string passwords using **Azure Managed Identities**.

Your App Service is granted a secure identity token tracked automatically by Azure's internal identity management system (**Microsoft Entra ID**). When your C# code attempts to interact with Azure Storage or SQL, the platform recognizes the App Service's identity and grants secure access natively without requiring a single hardcoded password string.