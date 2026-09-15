@description('The environment name, e.g., dev, staging, prod')
param environmentName string = 'prod'

@description('The primary Azure region for all resources')
param location string = resourceGroup().location

@description('The prefix for all deployed resources')
param resourcePrefix string = 'novamart'

@description('Administrator login for the PostgreSQL flexible server')
@secure()
param dbAdminUsername string = 'novamartadmin'

@description('Administrator password for the PostgreSQL flexible server')
@secure()
param dbAdminPassword string

var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)
var appServicePlanName = '${resourcePrefix}-asp-${environmentName}'
var appServiceName = '${resourcePrefix}-app-${environmentName}-${uniqueSuffix}'
var dbServerName = '${resourcePrefix}-psql-${environmentName}-${uniqueSuffix}'
var storageAccountName = '${resourcePrefix}sa${uniqueSuffix}'
var keyVaultName = '${resourcePrefix}-kv-${uniqueSuffix}'
var appInsightsName = '${resourcePrefix}-insights-${environmentName}'
var logAnalyticsWorkspaceName = '${resourcePrefix}-law-${environmentName}'

// 1. Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// 2. Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// 3. Azure Storage Account (Assets & Selenium Reports)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
  }
}

// Blob Container for Test Reports & Artifacts
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource reportsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'test-reports'
  properties: {
    publicAccess: 'Blob'
  }
}

// 4. Azure Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: true
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    accessPolicies: []
  }
}

// 5. Azure App Service Plan (Linux)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: 'B1'
    tier: 'Basic'
    capacity: 1
  }
  properties: {
    reserved: true
  }
}

// 6. Azure App Service (Web Application)
resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'npm run start'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '3000'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
      ]
    }
  }
}

// 7. Azure Database for PostgreSQL - Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: dbServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '15'
    administratorLogin: dbAdminUsername
    administratorLoginPassword: dbAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// Allow Azure Services Firewall Rule
resource postgresFirewallAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  parent: postgresServer
  name: 'AllowAllAzureServicesAndResourcesWithinAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output webAppUrl string = 'https://${appService.properties.defaultHostName}'
output keyVaultName string = keyVault.name
output storageAccountName string = storageAccount.name
output postgresServerFqdn string = postgresServer.properties.fullyQualifiedDomainName
