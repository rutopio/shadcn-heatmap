export type PropSpec = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: string;
};

export type ComponentPropsSection = {
  componentName: string;
  description: string;
  props: PropSpec[];
};

