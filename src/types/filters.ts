
export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}
