import { GraphQLClient, gql } from "graphql-request";

export interface ProboClientConfig {
  endpoint: string;
  apiKey: string;
}

export class ProboClient {
  private client: GraphQLClient;

  constructor(config: ProboClientConfig) {
    this.client = new GraphQLClient(config.endpoint, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    });
  }

  // Framework operations
  async listFrameworks(organizationId: string) {
    const query = gql`
      query ListFrameworks($id: ID!) {
        node(id: $id) {
          ... on Organization {
            frameworks(first: 100) {
              edges {
                node {
                  id
                  name
                  description
                }
              }
            }
          }
        }
      }
    `;
    return this.client.request(query, { id: organizationId });
  }

  async importFramework(input: {
    organizationId: string;
    framework: FrameworkImport;
  }) {
    const mutation = gql`
      mutation ImportFramework($input: ImportFrameworkInput!) {
        importFramework(input: $input) {
          framework {
            id
            name
          }
        }
      }
    `;
    return this.client.request(mutation, {
      input: {
        organizationId: input.organizationId,
        content: JSON.stringify(input.framework),
      },
    });
  }

  // Control operations
  async listControls(organizationId: string, frameworkId?: string) {
    const query = gql`
      query ListControls($id: ID!) {
        node(id: $id) {
          ... on Organization {
            controls(first: 100) {
              edges {
                node {
                  id
                  name
                  description
                  referenceId
                  framework {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;
    return this.client.request(query, { id: organizationId });
  }

  async createControl(input: {
    frameworkId: string;
    name: string;
    description: string;
    referenceId?: string;
  }) {
    const mutation = gql`
      mutation CreateControl($input: CreateControlInput!) {
        createControl(input: $input) {
          controlEdge {
            node {
              id
              name
            }
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  // Measure operations
  async listMeasures(organizationId: string) {
    const query = gql`
      query ListMeasures($id: ID!) {
        node(id: $id) {
          ... on Organization {
            measures(first: 100) {
              edges {
                node {
                  id
                  name
                  description
                  category
                  state
                }
              }
            }
          }
        }
      }
    `;
    return this.client.request(query, { id: organizationId });
  }

  async createMeasure(input: {
    organizationId: string;
    name: string;
    description: string;
    category: string;
  }) {
    const mutation = gql`
      mutation CreateMeasure($input: CreateMeasureInput!) {
        createMeasure(input: $input) {
          measureEdge {
            node {
              id
              name
            }
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  async importMeasures(input: { organizationId: string; content: string }) {
    const mutation = gql`
      mutation ImportMeasure($input: ImportMeasureInput!) {
        importMeasure(input: $input) {
          measures {
            id
            name
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  // Risk operations
  async listRisks(organizationId: string) {
    const query = gql`
      query ListRisks($id: ID!) {
        node(id: $id) {
          ... on Organization {
            risks(first: 100) {
              edges {
                node {
                  id
                  name
                  description
                  treatment
                  likelihood
                  impact
                }
              }
            }
          }
        }
      }
    `;
    return this.client.request(query, { id: organizationId });
  }

  async createRisk(input: {
    organizationId: string;
    name: string;
    description: string;
    treatment: "MITIGATED" | "ACCEPTED" | "AVOIDED" | "TRANSFERRED";
    likelihood?: number;
    impact?: number;
  }) {
    const mutation = gql`
      mutation CreateRisk($input: CreateRiskInput!) {
        createRisk(input: $input) {
          riskEdge {
            node {
              id
              name
            }
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  // Document operations
  async listDocuments(organizationId: string) {
    const query = gql`
      query ListDocuments($id: ID!) {
        node(id: $id) {
          ... on Organization {
            documents(first: 100) {
              edges {
                node {
                  id
                  title
                  status
                  documentType
                }
              }
            }
          }
        }
      }
    `;
    return this.client.request(query, { id: organizationId });
  }

  async createDocument(input: {
    organizationId: string;
    title: string;
    documentType: string;
    content?: string;
  }) {
    const mutation = gql`
      mutation CreateDocument($input: CreateDocumentInput!) {
        createDocument(input: $input) {
          documentEdge {
            node {
              id
              title
            }
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  // Vendor operations
  async listVendors(organizationId: string) {
    const query = gql`
      query ListVendors($id: ID!) {
        node(id: $id) {
          ... on Organization {
            vendors(first: 100) {
              edges {
                node {
                  id
                  name
                  description
                  websiteUrl
                  serviceCriticality
                }
              }
            }
          }
        }
      }
    `;
    return this.client.request(query, { id: organizationId });
  }

  async createVendor(input: {
    organizationId: string;
    name: string;
    description?: string;
    websiteUrl?: string;
  }) {
    const mutation = gql`
      mutation CreateVendor($input: CreateVendorInput!) {
        createVendor(input: $input) {
          vendorEdge {
            node {
              id
              name
            }
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  async assessVendor(input: { vendorId: string }) {
    const mutation = gql`
      mutation AssessVendor($input: AssessVendorInput!) {
        assessVendor(input: $input) {
          vendor {
            id
            name
          }
        }
      }
    `;
    return this.client.request(mutation, { input });
  }

  // Generic node fetch
  async getNode<T>(id: string): Promise<T> {
    const query = gql`
      query GetNode($id: ID!) {
        node(id: $id) {
          id
          ... on Organization {
            name
            description
          }
          ... on Framework {
            name
            description
          }
          ... on Control {
            name
            description
            referenceId
          }
          ... on Measure {
            name
            description
            category
            state
          }
          ... on Risk {
            name
            description
            treatment
          }
          ... on Document {
            title
            documentType
            status
          }
          ... on Vendor {
            name
            description
            websiteUrl
          }
        }
      }
    `;
    const result = await this.client.request<{ node: T }>(query, { id });
    return result.node;
  }
}

// Types for framework import
export interface FrameworkImport {
  framework: {
    id: string;
    name: string;
    logo?: {
      light?: string;
      dark?: string;
    };
    controls: Array<{
      id: string;
      name: string;
      description: string;
      best_practice?: boolean;
    }>;
  };
}

export { gql };
