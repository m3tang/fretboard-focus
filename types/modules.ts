export type Module = {
  id: string; // UUID
  name: string; // narrowed to allowed list
  description?: string;
  isDefault: boolean;
  userId?: string | null;
};
