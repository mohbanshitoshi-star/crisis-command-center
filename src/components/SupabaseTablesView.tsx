import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  Users, 
  FolderKanban, 
  GitBranch, 
  RefreshCw, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  ArrowRight,
  Filter,
  Code2,
  Calendar,
  Activity,
  X
} from 'lucide-react';

interface UserRecord {
  id: number;
  uid: string;
  fullName: string;
  email: string;
  role: string | null;
  status: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

interface ProjectRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  priority: string;
  ownerId: number | null;
  ownerName?: string | null;
  ownerEmail?: string | null;
  createdAt: string;
}

interface InteractionRecord {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  projectId: number;
  projectName: string;
  projectSlug: string;
  projectStatus: string;
  interactionType: string;
  roleInProject: string | null;
  activitySummary: string | null;
  commitsCount: number | null;
  lastActiveAt: string | null;
  createdAt: string | null;
}

export const SupabaseTablesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interactions' | 'users' | 'projects' | 'matrix'>('interactions');
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>([]);
  const [interactionsList, setInteractionsList] = useState<InteractionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Modal states for creating records
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'interaction' | 'user' | 'project'>('interaction');
  
  // Form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Senior Systems Engineer');

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState('high');

  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('');
  const [newInteractionType, setNewInteractionType] = useState('Feature Commit');
  const [newRoleInProject, setNewRoleInProject] = useState('Core Dev');
  const [newActivitySummary, setNewActivitySummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDatabaseTables = async () => {
    setIsLoading(true);
    try {
      const [usersRes, projectsRes, interactionsRes] = await Promise.all([
        fetch('/api/db/users'),
        fetch('/api/db/projects'),
        fetch('/api/db/interactions'),
      ]);

      if (usersRes.ok) {
        const u = await usersRes.json();
        setUsersList(u.data || []);
      }
      if (projectsRes.ok) {
        const p = await projectsRes.json();
        setProjectsList(p.data || []);
      }
      if (interactionsRes.ok) {
        const i = await interactionsRes.json();
        setInteractionsList(i.data || []);
      }
    } catch (err) {
      console.error('Error fetching database tables:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseTables();
  }, []);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalType === 'user') {
        const res = await fetch('/api/db/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: newUserName, email: newUserEmail, role: newUserRole }),
        });
        if (res.ok) {
          setNewUserName('');
          setNewUserEmail('');
          setIsModalOpen(false);
          await fetchDatabaseTables();
        }
      } else if (modalType === 'project') {
        const res = await fetch('/api/db/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newProjectName, description: newProjectDesc, priority: newProjectPriority, ownerId: usersList[0]?.id }),
        });
        if (res.ok) {
          setNewProjectName('');
          setNewProjectDesc('');
          setIsModalOpen(false);
          await fetchDatabaseTables();
        }
      } else if (modalType === 'interaction') {
        const res = await fetch('/api/db/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedUserId || usersList[0]?.id,
            projectId: selectedProjectId || projectsList[0]?.id,
            interactionType: newInteractionType,
            roleInProject: newRoleInProject,
            activitySummary: newActivitySummary || 'Contributed to tactical deployment and architectural modules.',
          }),
        });
        if (res.ok) {
          setNewActivitySummary('');
          setIsModalOpen(false);
          await fetchDatabaseTables();
        }
      }
    } catch (err) {
      console.error('Failed to create record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInteractions = interactionsList.filter(i => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      i.userName.toLowerCase().includes(q) ||
      i.projectName.toLowerCase().includes(q) ||
      i.interactionType.toLowerCase().includes(q) ||
      (i.activitySummary && i.activitySummary.toLowerCase().includes(q));
    
    if (filterType === 'all') return matchSearch;
    return matchSearch && i.interactionType.toLowerCase().includes(filterType.toLowerCase());
  });

  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.role && u.role.toLowerCase().includes(q));
  });

  const filteredProjects = projectsList.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0f16] text-[#e3e8f0] overflow-y-auto p-4 md:p-8 select-none">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* Top Header Banner with Database Metadata */}
        <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Supabase / Cloud SQL Table Studio</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                  CONNECTED &bull; POSTGRESQL 15
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Relational schemas: Users, Projects, and User-Project Interactions with foreign keys
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchDatabaseTables}
              disabled={isLoading}
              className="px-3.5 py-2 bg-[#18202d] hover:bg-[#20293a] border border-[#28354a] rounded-xl text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh Tables</span>
            </button>

            <button
              onClick={() => {
                setModalType(activeTab === 'users' ? 'user' : activeTab === 'projects' ? 'project' : 'interaction');
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Insert Record</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Table Editor Tabs) */}
        <div className="flex items-center justify-between border-b border-[#202838] pb-1 gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'interactions'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#151b27]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>User &amp; Project Interactions</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#1d2636] text-[10px] font-mono">
                {interactionsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#151b27]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>public.users</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#1d2636] text-[10px] font-mono">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#151b27]'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>public.projects</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#1d2636] text-[10px] font-mono">
                {projectsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#151b27]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Interactive Relational Graph</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Host: <strong className="text-slate-400">asia-southeast1</strong>
            </span>
          </div>
        </div>

        {/* Search & Query Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#11151f] p-3 rounded-xl border border-[#1e2636]">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-[#18202d] border border-[#263347] rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {activeTab === 'interactions' && 'SELECT * FROM project_interactions JOIN users JOIN projects;'}
                {activeTab === 'users' && 'SELECT * FROM users ORDER BY created_at DESC;'}
                {activeTab === 'projects' && 'SELECT * FROM projects ORDER BY created_at DESC;'}
                {activeTab === 'matrix' && 'RELATIONAL GRAPH MAPPING: User.id ⟷ Project.id'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab 1: Project Interactions Table (User <-> Project Join) */}
        {activeTab === 'interactions' && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3 bg-[#151a27] border-b border-[#202838] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-semibold">public.project_interactions</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-400">{filteredInteractions.length} records</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Foreign Keys: user_id ➔ users.id, project_id ➔ projects.id</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202838] bg-[#0f131c] text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-4">id (int4)</th>
                    <th className="py-3 px-4">User (FK: user_id)</th>
                    <th className="py-3 px-4">Project (FK: project_id)</th>
                    <th className="py-3 px-4">Interaction Type</th>
                    <th className="py-3 px-4">Role in Project</th>
                    <th className="py-3 px-4">Activity Summary</th>
                    <th className="py-3 px-4">Commits</th>
                    <th className="py-3 px-4">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2638]">
                  {filteredInteractions.length > 0 ? (
                    filteredInteractions.map((item) => (
                      <tr key={item.id} className="hover:bg-[#161c2a] transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400">{item.id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {item.userAvatar ? (
                              <img src={item.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                                {item.userName[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white">{item.userName}</p>
                              <p className="text-[10px] text-slate-400">{item.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-semibold text-emerald-400">{item.projectName}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">{item.projectSlug}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {item.interactionType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-medium">{item.roleInProject || 'Contributor'}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={item.activitySummary || ''}>
                          {item.activitySummary || 'Operational activity logged'}
                        </td>
                        <td className="py-3 px-4 font-mono text-blue-400">{item.commitsCount || 1}</td>
                        <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                          {item.lastActiveAt ? new Date(item.lastActiveAt).toLocaleString() : 'Just now'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        {isLoading ? 'Querying PostgreSQL tables...' : 'No interaction records found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users Table */}
        {activeTab === 'users' && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3 bg-[#151a27] border-b border-[#202838] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-semibold">public.users</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-400">{filteredUsers.length} records</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Primary Key: id (serial)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202838] bg-[#0f131c] text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-4">id (PK)</th>
                    <th className="py-3 px-4">uid (unique)</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2638]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#161c2a] transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{user.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{user.uid}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                              {user.fullName[0]}
                            </div>
                          )}
                          <span className="font-semibold text-white">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{user.email}</td>
                      <td className="py-3 px-4 text-blue-400">{user.role || 'Staff Engineer'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Projects Table */}
        {activeTab === 'projects' && (
          <div className="bg-[#121622] border border-[#222c3d] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3 bg-[#151a27] border-b border-[#202838] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-semibold">public.projects</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-400">{filteredProjects.length} records</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Owner FK ➔ users.id</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202838] bg-[#0f131c] text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-4">id (PK)</th>
                    <th className="py-3 px-4">Project Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Owner (FK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2638]">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#161c2a] transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{p.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{p.slug}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-sm truncate" title={p.description || ''}>
                        {p.description || 'No description provided'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {p.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {p.ownerName ? `${p.ownerName} (#${p.ownerId})` : 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Interactive Relational Matrix (Visualizing User ↔ Project Interaction) */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="bg-[#121622] border border-[#222c3d] rounded-2xl p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                <span>Relational Mapping: Which Users are Interacting With Which Projects?</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Interactive many-to-many relationship mapping between <strong>public.users</strong> and <strong>public.projects</strong> via <strong>public.project_interactions</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsList.map((project) => {
                  const projectAssignedInteractions = interactionsList.filter(i => i.projectId === project.id);
                  return (
                    <div key={project.id} className="p-4 bg-[#161c2a] border border-[#263347] rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-[#222c3d] pb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white">{project.name}</h4>
                          <span className="text-[10px] font-mono text-emerald-400">{project.slug}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {projectAssignedInteractions.length} Collaborator{projectAssignedInteractions.length === 1 ? '' : 's'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">{project.description}</p>

                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block">
                          Active Interactions &amp; Roles:
                        </span>
                        {projectAssignedInteractions.map((act) => (
                          <div key={act.id} className="p-2.5 bg-[#0f131c] rounded-lg border border-[#1e2636] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                                {act.userName[0]}
                              </div>
                              <div>
                                <span className="font-semibold text-white">{act.userName}</span>
                                <span className="text-[10px] text-slate-400 ml-1.5">({act.roleInProject})</span>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
                              {act.interactionType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Insert Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141822] border border-[#2b3548] rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Insert New Record into Database</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#202737] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector for which table to insert into */}
            <div className="flex gap-2 p-1 bg-[#0f131c] rounded-xl border border-[#222c3d]">
              <button
                type="button"
                onClick={() => setModalType('interaction')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  modalType === 'interaction' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Interaction
              </button>
              <button
                type="button"
                onClick={() => setModalType('user')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  modalType === 'user' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setModalType('project')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  modalType === 'project' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Project
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
              {modalType === 'interaction' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select User (Foreign Key)</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(Number(e.target.value))}
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {usersList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Select Project (Foreign Key)</label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {projectsList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Interaction Type</label>
                    <input
                      type="text"
                      value={newInteractionType}
                      onChange={(e) => setNewInteractionType(e.target.value)}
                      placeholder="e.g. Code Review, Deployment, Architecture Lead"
                      required
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Role in Project</label>
                    <input
                      type="text"
                      value={newRoleInProject}
                      onChange={(e) => setNewRoleInProject(e.target.value)}
                      placeholder="e.g. Security Lead, DevOps, Core Contributor"
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Activity Summary</label>
                    <textarea
                      rows={2}
                      value={newActivitySummary}
                      onChange={(e) => setNewActivitySummary(e.target.value)}
                      placeholder="Describe what the user did on this project..."
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </>
              )}

              {modalType === 'user' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      required
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. maya.lin@aegis-intel.io"
                      required
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Role</label>
                    <input
                      type="text"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      placeholder="e.g. Intelligence Analyst"
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {modalType === 'project' && (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="e.g. Project Quantum Beacon"
                      required
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="Short objective of this project..."
                      className="w-full bg-[#18202d] border border-[#263347] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222c3d]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>{isSubmitting ? 'Saving to Database...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
