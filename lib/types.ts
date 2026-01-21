export type Autonomy = "L1" | "L2" | "L3" | "L4";
export type AgentStatus = "Draft" | "Active" | "Paused" | "Killed";

export type Agent = {
  agent_id: string;
  name: string;
  system: "Salesforce" | "Workday" | "ServiceNow" | "AWS" | "n8n";
  purpose: string;
  autonomy: Autonomy;
  approval_mode: string;
  risk_tier: "Low" | "Medium" | "High";
  status: AgentStatus;
  owner: string;
  last_activity: string;
};

export type Scenario = {
  id: string;
  name: string;
  system: Agent["system"];
  problem_statement: string;
  safe_path: string;
  risky_path: string;
};

export type WorkflowStep = { name: string; status: "done" | "waiting" | "blocked" };
export type WorkflowRun = {
  run_id: string;
  agent_id: string;
  agent_name: string;
  scenario: string;
  trigger: string;
  decision: "ALLOW" | "DENY" | "REQUIRES_APPROVAL";
  approval_path: string;
  steps: WorkflowStep[];
  ts: string;
};

export type AuditEvent = {
  event_id: string;
  run_id: string;
  agent_id: string;
  event: string;
  result: string;
  obligations: string[];
  ts: string;
};

export type AgentSpec = {
  spec_id: string;
  title: string;
  system: Agent["system"];
  problem_statement: string;
  persona: string;
  business_outcome: string;
  agent_type: "Advisor" | "Executor" | "Monitor" | "Orchestrator";
  outputs: string[];
  autonomy: Autonomy;
  approvals: "0" | "1" | "2+";
  data_sensitivity: "Public" | "Internal" | "Confidential" | "Restricted";
  allowed_actions: string[];
  disallowed_actions: string[];
  obligations: string[];
  success_criteria: string[];
  created_at: string;
};
