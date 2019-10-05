interface FieldBase<T extends string> {
  type: T;
  text: string;
  value: string;
  required?: boolean;
}

export interface TextField extends FieldBase<'text'> {}

export interface TableField extends FieldBase<'table'> {
  fields: Field[];
}

type Field = TextField | TableField;
export default Field;
