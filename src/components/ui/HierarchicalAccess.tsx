import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Globe, Building, MapPin } from 'lucide-react';

interface AccessLevel {
  id: string;
  name: string;
  children?: AccessLevel[];
}

interface HierarchicalAccessProps {
  label: string;
  placeholder: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
}

// Mock data - in a real app, this would come from an API
const accessData: AccessLevel[] = [
  {
    id: 'region-1',
    name: 'Greater Accra Region',
    children: [
      {
        id: 'ws-1',
        name: 'Kweiman-Danfa Water System',
        children: [
          { id: 'zone-1', name: 'Zone 1' },
          { id: 'zone-2', name: 'Zone 2' },
          { id: 'zone-3', name: 'Zone 3' },
          { id: 'zone-4', name: 'Zone 4' },
          { id: 'zone-5', name: 'Zone 5' },
          { id: 'zone-6', name: 'Zone 6' }
        ]
      },
      {
        id: 'ws-2',
        name: 'Tema Water System',
        children: [
          { id: 'zone-7', name: 'Zone A' },
          { id: 'zone-8', name: 'Zone B' },
          { id: 'zone-9', name: 'Zone C' }
        ]
      }
    ]
  },
  {
    id: 'region-2',
    name: 'Ashanti Region',
    children: [
      {
        id: 'ws-3',
        name: 'Kumasi Water System',
        children: [
          { id: 'zone-10', name: 'Zone 1' },
          { id: 'zone-11', name: 'Zone 2' }
        ]
      }
    ]
  }
];

export const HierarchicalAccess: React.FC<HierarchicalAccessProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [accessType, setAccessType] = useState<'global' | 'custom'>('custom');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (value) {
      if (value.type === 'global') {
        setAccessType('global');
      } else {
        setAccessType('custom');
        setSelectedItems(new Set(value.items || []));
      }
    }
  }, [value]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Helper function to get all descendant IDs of a node
  const getAllDescendants = (node: AccessLevel): string[] => {
    const descendants: string[] = [];
    if (node.children) {
      for (const child of node.children) {
        descendants.push(child.id);
        descendants.push(...getAllDescendants(child));
      }
    }
    return descendants;
  };

  // Helper function to get all ancestor IDs of a node
  const getAllAncestors = (nodeId: string, data: AccessLevel[]): string[] => {
    const ancestors: string[] = [];
    
    const findAncestors = (nodes: AccessLevel[], targetId: string, currentPath: string[]): boolean => {
      for (const node of nodes) {
        const newPath = [...currentPath, node.id];
        
        if (node.id === targetId) {
          ancestors.push(...currentPath);
          return true;
        }
        
        if (node.children && findAncestors(node.children, targetId, newPath)) {
          return true;
        }
      }
      return false;
    };
    
    findAncestors(data, nodeId, []);
    return ancestors;
  };

  // Helper function to check if all children of a node are selected
  const areAllChildrenSelected = (node: AccessLevel, selected: Set<string>): boolean => {
    if (!node.children || node.children.length === 0) {
      return true;
    }
    
    return node.children.every(child => selected.has(child.id));
  };

  const toggleSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    
    // Find the node being toggled
    const findNode = (nodes: AccessLevel[], id: string): AccessLevel | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const targetNode = findNode(accessData, itemId);
    if (!targetNode) return;

    const isCurrentlySelected = newSelected.has(itemId);
    
    if (isCurrentlySelected) {
      // Deselecting: remove this item and all its descendants
      newSelected.delete(itemId);
      const descendants = getAllDescendants(targetNode);
      descendants.forEach(id => newSelected.delete(id));
    } else {
      // Selecting: add this item and all its descendants
      newSelected.add(itemId);
      const descendants = getAllDescendants(targetNode);
      descendants.forEach(id => newSelected.add(id));
      
      // Auto-select ancestors if all their children are now selected
      const ancestors = getAllAncestors(itemId, accessData);
      for (const ancestorId of ancestors) {
        const ancestorNode = findNode(accessData, ancestorId);
        if (ancestorNode && areAllChildrenSelected(ancestorNode, newSelected)) {
          newSelected.add(ancestorId);
        }
      }
    }
    
    setSelectedItems(newSelected);
    
    onChange({
      type: 'custom',
      items: Array.from(newSelected)
    });
  };

  const handleAccessTypeChange = (type: 'global' | 'custom') => {
    setAccessType(type);
    if (type === 'global') {
      setSelectedItems(new Set());
      onChange({
        type: 'global',
        items: []
      });
    } else {
      onChange({
        type: 'custom',
        items: Array.from(selectedItems)
      });
    }
  };

  // Helper function to check if a node is partially selected (some but not all children selected)
  const isPartiallySelected = (node: AccessLevel): boolean => {
    if (!node.children || node.children.length === 0) {
      return false;
    }
    
    const selectedChildren = node.children.filter(child => selectedItems.has(child.id));
    return selectedChildren.length > 0 && selectedChildren.length < node.children.length;
  };

  const renderTreeNode = (node: AccessLevel, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedItems.has(node.id);
    const isPartial = isPartiallySelected(node);
    const hasChildren = node.children && node.children.length > 0;

    const getIcon = () => {
      if (level === 0) return <Globe className="w-4 h-4 text-blue-500" />;
      if (level === 1) return <Building className="w-4 h-4 text-green-500" />;
      return <MapPin className="w-4 h-4 text-orange-500" />;
    };

    return (
      <div key={node.id} className={`ml-${level * 4}`}>
        <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg">
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            {accessType === 'custom' && (
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(node.id)}
                  className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                    isPartial ? 'opacity-50' : ''
                  }`}
                />
                {isPartial && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                  </div>
                )}
              </div>
            )}
            {getIcon()}
            <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'} ${isPartial ? 'text-gray-800' : ''}`}>
              {node.name}
              {isPartial && <span className="text-xs text-gray-500 ml-1">(partial)</span>}
            </span>
          </label>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getDisplayValue = () => {
    if (accessType === 'global') {
      return 'Global Access - All Regions, Water Systems, and Zones';
    }
    
    if (selectedItems.size === 0) {
      return placeholder;
    }
    
    // Count by type
    const regions = new Set<string>();
    const waterSystems = new Set<string>();
    const zones = new Set<string>();
    
    selectedItems.forEach(id => {
      if (id.startsWith('region-')) regions.add(id);
      else if (id.startsWith('ws-')) waterSystems.add(id);
      else if (id.startsWith('zone-')) zones.add(id);
    });
    
    const parts = [];
    if (regions.size > 0) parts.push(`${regions.size} region${regions.size > 1 ? 's' : ''}`);
    if (waterSystems.size > 0) parts.push(`${waterSystems.size} water system${waterSystems.size > 1 ? 's' : ''}`);
    if (zones.size > 0) parts.push(`${zones.size} zone${zones.size > 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') + ' selected' : `${selectedItems.size} item(s) selected`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className={selectedItems.size === 0 && accessType !== 'global' ? 'text-gray-400' : 'text-gray-900'}>
              {getDisplayValue()}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Access Level</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accessType"
                      value="global"
                      checked={accessType === 'global'}
                      onChange={() => handleAccessTypeChange('global')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Global Access (All Regions, Water Systems & Zones)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="accessType"
                      value="custom"
                      checked={accessType === 'custom'}
                      onChange={() => handleAccessTypeChange('custom')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">Custom Access (Select Specific Items)</span>
                  </label>
                </div>
              </div>
            </div>

            {accessType === 'custom' && (
              <div className="p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Select Access Permissions:</div>
                <div className="space-y-1">
                  {accessData.map(region => renderTreeNode(region, 0))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};