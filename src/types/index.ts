export interface User {
  id: string;
  user_handle: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total_count: number;
  page: number;
  per_page: number;
}

export interface DummyData {
  id: string;
  project_id: number;
  table_name: string;
  column_name: string[];
  column_type: string[];
  column_validate: string[];
  created_at: string;
  updated_at: string;
}
