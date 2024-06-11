import { Html } from "@elysiajs/html";
import { Todo as TodoType } from "../db/schema";
import { Loader } from "../components/ui/loader";
import { Icon } from "./ui/icon";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

type NewTodoFormProps = Partial<{
  value: string;
  error: string;
}> &
  JSX.HtmlFormTag;

export const NewTodoForm = ({ error, value, ...props }: NewTodoFormProps) => {
  return (
    <form
      class="mx-auto grid grid-cols-[1fr_auto] gap-3"
      hx-post="/todos"
      hx-swap="afterbegin"
      hx-target="ol"
      hx-indicator="form > button"
      hx-disabled-elt="form > button"
      {...{ "hx-target-4*": "this" }}
      {...props}
    >
      <Input type="text" name="title" placeholder="walk..." value={value} />

      <Button
        title="add"
        class="group flex items-center justify-center rounded-full text-xl font-bold"
        size="icon"
      >
        <Icon icon="plus" size="sm" class="group-[.htmx-request]:hidden" />
        <Loader class="m-auto" />
      </Button>

      {error && <p class="text-sm text-destructive-foreground">{error}</p>}
    </form>
  );
};

type TodoItemProps = { todo: TodoType } & JSX.HtmlLITag;

export const TodoItem = ({ todo, ...props }: TodoItemProps) => {
  return (
    <li
      class="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 px-2 py-1 transition-colors hover:bg-muted"
      {...props}
    >
      <Checkbox
        id={`toggle-todo-${todo.id}`}
        class="peer"
        hx-patch={`/todos/${todo.id}/toggle`}
        checked={todo.done}
      />
      <label
        for={`toggle-todo-${todo.id}`}
        class="truncate peer-checked:line-through"
      >
        {todo.title}
      </label>
      <Button
        variant="ghost"
        size="icon"
        class="group flex h-6 w-6 rounded-md text-muted-foreground hover:bg-zinc-300"
        title="edit"
        id={`edit-todo-${todo.id}`}
      >
        <Icon icon="edit" size="sm" class="group-[.htmx-request]:hidden" />
        <Loader />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        id={`delete-todo-${todo.id}`}
        class="group h-6 w-6 rounded-md text-destructive-foreground hover:bg-destructive/10"
        title="delete"
        hx-delete={`/todos/${todo.id}`}
        hx-target="closest li"
        hx-swap="outerHTML"
        hx-disabled-elt="this"
      >
        <Icon icon="trash" size="sm" class="group-[.htmx-request]:hidden" />
        <Loader />
      </Button>
    </li>
  );
};

export const TodoList = (props: JSX.HtmlOListTag) => {
  return (
    <ol
      hx-swap="afterbegin"
      hx-indicator=".todo-item-skeleton"
      hx-disinherit="hx-indicator"
      class="divide-y divide-border"
      {...props}
    >
      {props.children}
    </ol>
  );
};

type TodoListRowsProps = {
  todos: Array<TodoType>;
  page: number;
  todosPerPage: number;
};

export const TodoListRows = ({
  todos,
  page,
  todosPerPage,
}: TodoListRowsProps) => {
  return (
    <>
      {todos.map((todo, i) => {
        if (i === todos.length - 1 && todos.length === todosPerPage) {
          return (
            <TodoItem
              todo={todo}
              hx-get={`/todos/?page=${page + 1}`}
              hx-trigger="revealed"
              hx-swap="afterend"
              hx-indicator=".todo-item-skeleton"
            />
          );
        }

        return <TodoItem todo={todo} />;
      })}
    </>
  );
};

export const TodoListEmptyMsg = () => {
  return <li class="text-center text-muted-foreground"> all done 🎉 </li>;
};

export const TodoSkeleton = () => {
  return (
    <li class="todo-item-skeleton hidden h-8 items-center [&.htmx-request]:flex">
      <div
        class="h-2 animate-pulse rounded-md bg-muted"
        style={{ width: `${Math.random() * 100 + 100}px` }}
      />
    </li>
  );
};
