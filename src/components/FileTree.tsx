import * as React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { Artifact } from '../services/artifactService';

interface FileTreeProps {
  artifacts: Artifact[];
  onSelectFile: (artifact: Artifact) => void;
  selectedPath?: string;
}

interface TreeNode {
  name: string;
  path: string;
  children: { [key: string]: TreeNode };
  artifact?: Artifact;
}

export const FileTree = ({ artifacts, onSelectFile, selectedPath }: FileTreeProps) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({ 'root': true });

  const tree = React.useMemo(() => {
    const root: TreeNode = { name: 'root', path: '', children: {} };
    
    artifacts.forEach(artifact => {
      const parts = artifact.path.split('/');
      let current = root;
      
      parts.forEach((part, index) => {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            children: {}
          };
        }
        current = current.children[part];
        if (index === parts.length - 1) {
          current.artifact = artifact;
        }
      });
    });
    
    return root;
  }, [artifacts]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const isFolder = Object.keys(node.children).length > 0;
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedPath === node.path;

    if (node.name === 'root') {
      return Object.values(node.children).map(child => renderNode(child, 0));
    }

    return (
      <div key={node.path} className="select-none">
        <div 
          onClick={() => {
            if (isFolder) toggleFolder(node.path);
            else if (node.artifact) onSelectFile(node.artifact);
          }}
          className={`
            flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-white/5 transition-colors
            ${isSelected ? 'bg-brand-blue/10 text-brand-blue' : 'text-text-secondary hover:text-white'}
          `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <Folder className="w-4 h-4 text-brand-blue/60" />
            </>
          ) : (
            <>
              <div className="w-3.5" />
              <File className="w-4 h-4 text-text-muted" />
            </>
          )}
          <span className="text-[12px] font-medium truncate">{node.name}</span>
        </div>
        
        {isFolder && isExpanded && (
          <div>
            {Object.values(node.children)
              .sort((a, b) => {
                const aIsFolder = Object.keys(a.children).length > 0;
                const bIsFolder = Object.keys(b.children).length > 0;
                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;
                return a.name.localeCompare(b.name);
              })
              .map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-2 overflow-auto h-full custom-scrollbar">
      {renderNode(tree, 0)}
    </div>
  );
};
