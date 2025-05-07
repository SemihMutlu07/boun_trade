import { Grid, List, LayoutGrid } from 'lucide-react';

type ViewType = 'grid' | 'list' | 'masonry';

interface ViewTypeSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewTypeSelector({ currentView, onViewChange }: ViewTypeSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-zinc-800 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'grid' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
        }`}
        aria-label="Grid view"
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'list' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
        }`}
        aria-label="List view"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => onViewChange('masonry')}
        className={`p-2 rounded-md transition-colors ${
          currentView === 'masonry' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
        }`}
        aria-label="Masonry view"
      >
        <LayoutGrid size={20} />
      </button>
    </div>
  );
} 