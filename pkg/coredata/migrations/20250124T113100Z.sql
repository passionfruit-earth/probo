CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE frameworks (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content_ref TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE controls (
  id UUID PRIMARY KEY,
  framework_id UUID REFERENCES frameworks(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content_ref TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  control_id UUID REFERENCES controls(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  content_ref TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
