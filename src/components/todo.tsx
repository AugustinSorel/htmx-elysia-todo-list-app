import { Html } from "@elysiajs/html";
import { Todo as TodoType } from "../db/schema";
import { Loader } from "../components/ui/loader";
import { Icon } from "./ui/icon";
import { Button, ButtonProps } from "./ui/button";
import { Checkbox as CheckboxPrimitive, CheckboxProps } from "./ui/checkbox";
import { Input, InputProps } from "./ui/input";

const Item = (props: JSX.HtmlButtonTag) => {
  return (
    <li
      class="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 px-2 py-1 transition-colors hover:bg-muted"
      {...props}
    >
      {props.children}
    </li>
  );
};

const Label = ({
  todoId,
  ...props
}: JSX.HtmlLabelTag & { todoId: TodoType["id"] }) => {
  return (
    <label
      for={`toggle-todo-${todoId}`}
      class="truncate peer-checked:line-through"
      {...props}
    >
      {props.children}
    </label>
  );
};

const Checkbox = ({
  todoId,
  ...props
}: CheckboxProps & { todoId: TodoType["id"] }) => {
  return (
    <CheckboxPrimitive
      id={`toggle-todo-${todoId}`}
      class="peer"
      hx-patch={`/api/todos/${todoId}/toggle`}
      {...props}
    />
  );
};

const DeleteBtn = ({
  todoId,
  ...props
}: JSX.HtmlButtonTag & { todoId: TodoType["id"] }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      id={`delete-todo-${todoId}`}
      class="group h-6 w-6 rounded-md text-destructive-foreground hover:bg-destructive/10"
      title="delete"
      hx-delete={`/api/todos/${todoId}`}
      hx-target="closest li"
      hx-swap="outerHTML"
      hx-disabled-elt="this"
      {...props}
    >
      <Icon icon="trash" size="sm" class="group-[.htmx-request]:hidden" />
      <Loader />
    </Button>
  );
};

const EditBtn = ({
  todoId,
  ...props
}: JSX.HtmlButtonTag & { todoId: TodoType["id"] }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      class="group flex h-6 w-6 rounded-md text-muted-foreground hover:bg-zinc-300"
      title="edit"
      id={`edit-todo-${todoId}`}
      {...props}
    >
      <Icon icon="edit" size="sm" class="group-[.htmx-request]:hidden" />
      <Loader />
    </Button>
  );
};

const List = (props: JSX.HtmlOListTag) => {
  return (
    <ol
      hx-get="/api/todos"
      hx-swap="afterbegin"
      hx-trigger="load"
      hx-indicator=".todo-item-skeleton"
      hx-disinherit="hx-indicator"
      class="divide-y divide-border"
      {...props}
    >
      {props.children}
    </ol>
  );
};

const EmptyText = (props: JSX.HtmlTag) => {
  return (
    <p class="text-center text-muted-foreground" {...props}>
      {props.children}
    </p>
  );
};

const Skeleton = () => {
  return (
    <li class="todo-item-skeleton hidden h-8 items-center [&.htmx-request]:flex">
      <div
        class="h-2 animate-pulse rounded-md bg-muted"
        style={{ width: `${Math.random() * 100 + 100}px` }}
      />
    </li>
  );
};

const Form = (props: JSX.HtmlFormTag) => {
  return (
    <form
      class="mx-auto grid grid-cols-[1fr_auto] gap-3"
      hx-post="/api/todos"
      hx-swap="afterbegin"
      hx-target="ol"
      hx-indicator="form > button"
      hx-disabled-elt="form > button"
      {...{ "hx-target-4*": "this" }}
      {...props}
    >
      {props.children}
    </form>
  );
};

const FormErrorMsg = (props: JSX.HtmlTag) => {
  return (
    <p {...props} class="text-sm text-destructive-foreground">
      {props.children}
    </p>
  );
};

const FormTitleInput = (props: InputProps) => {
  return <Input type="text" name="title" placeholder="walk..." {...props} />;
};

const FormSubmitButton = (props: ButtonProps) => {
  return (
    <Button
      title="add"
      class="group flex items-center justify-center rounded-full text-xl font-bold"
      size="icon"
      {...props}
    >
      <Icon icon="plus" size="sm" class="group-[.htmx-request]:hidden" />
      <Loader class="m-auto" />
    </Button>
  );
};

export const Todo = {
  List,
  EmptyText,
  Label,
  Checkbox,
  Item,
  DeleteBtn,
  EditBtn,
  Skeleton,
  Form,
  FormTitleInput,
  FormSubmitButton,
  FormErrorMsg,
};
