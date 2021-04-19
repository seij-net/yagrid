export interface SampleItem {
  id: string;
  label: string;
  description: string | null;
  amount: number | null;
  cb: boolean | null;
  readonly?: boolean,
  deletable?: boolean
}

export const sampledata: SampleItem[] = [
  { id: "1", label: "item 1", description: "description 1", amount: 123456, cb: true },
  { id: "2", label: "item 2", description: "description 2", amount: 978654, cb: false },
  { id: "3", label: "item almost empty", description: null, amount: null, cb: null },
  { id: "4", label: "not editable but delete ok", description: null, amount: null, cb: null, readonly: true },
  {
    id: "5",
    label: "editable but can not be deleted",
    description: null,
    amount: null,
    cb: null,
    readonly: false,
    deletable: false,
  },
];