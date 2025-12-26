import { useState } from 'react';
import { useCategories } from '../hooks/use-categories';
import { useCreateCategory } from '../hooks/use-create-category';
import { useUpdateCategory } from '../hooks/use-update-category';
import { useDeleteCategory } from '../hooks/use-delete-category';
import { Button } from '@/domains/ui-system/components/button';
import { Input } from '@/domains/ui-system/components/input';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { I_CategoryTreeNode } from '../types';
import { cn } from '@/domains/ui-system/utils';

interface CategoryItemProps {
  category: I_CategoryTreeNode;
  level: number;
}

const CategoryItem = ({ category, level }: CategoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: createCategory } = useCreateCategory();

  const handleUpdate = () => {
    updateCategory({ id: category.id, data: { name: editName } });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(category.id);
    }
  };

  const handleAddSub = () => {
    if (!newSubName.trim()) return;
    createCategory({ name: newSubName, parent_id: category.id });
    setNewSubName('');
    setIsAddingSub(false);
    setIsOpen(true);
  };

  return (
    <div className="my-1">
      <div
        className={cn(
          'flex items-center gap-2 py-1 group rounded hover:bg-muted/10 pr-2',
          level > 0 && 'ml-4 border-l border-border/40 pl-2'
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn('h-6 w-6 p-0', category.children.length === 0 && 'opacity-0')}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="h-7 w-40"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleUpdate()}
            />
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleUpdate}>
              <Save className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <span className="font-medium text-sm">{category.name}</span>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsAddingSub(true)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Sub Category Creator */}
      {isAddingSub && (
        <div className={cn('flex items-center gap-2 my-1', level >= 0 && 'ml-12')}>
          <Input
            value={newSubName}
            onChange={e => setNewSubName(e.target.value)}
            placeholder="Sub-category name"
            className="h-7 w-40"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleAddSub()}
          />
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleAddSub}>
            <Save className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setIsAddingSub(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Children */}
      {isOpen && category.children.length > 0 && (
        <div className="flex flex-col">
          {category.children.map(child => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryManager = () => {
  const { data: categories, isLoading } = useCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const { mutate: createCategory } = useCreateCategory();

  const handleCreateRoot = () => {
    if (!newName.trim()) return;
    createCategory({ name: newName });
    setNewName('');
    setIsAdding(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Manage Categories</h3>
        <Button size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 mb-4 p-2 border rounded bg-muted/20">
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name"
            className="h-8 w-60"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreateRoot()}
          />
          <Button size="sm" onClick={handleCreateRoot}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {categories?.map(category => (
          <CategoryItem key={category.id} category={category} level={0} />
        ))}
      </div>
    </div>
  );
};
