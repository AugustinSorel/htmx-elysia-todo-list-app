export type CheckboxProps = JSX.HtmlInputTag;

export const Checkbox = (props: CheckboxProps) => {
  return <input type="checkbox" {...props} />;
};
