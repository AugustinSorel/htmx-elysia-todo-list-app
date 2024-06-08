import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "./ui/link";

const SignUpForm = (props: JSX.HtmlFormTag) => {
  return (
    <form
      class="group flex flex-col [&>button]:mt-10 [&>label]:mb-1 [&>label]:mt-4"
      hx-post="/api/auth/sign-up"
      hx-disabled-elt="button"
      hx-swap="outerHTML"
      {...{ "hx-target-4*": "this" }}
      {...props}
    >
      {props.children}
    </form>
  );
};

const SignInForm = (props: JSX.HtmlFormTag) => {
  return (
    <form
      class="group flex flex-col [&>button]:mt-10 [&>label]:mb-1 [&>label]:mt-4"
      hx-post="/api/auth/sign-in"
      hx-disabled-elt="button"
      hx-swap="outerHTML"
      {...{ "hx-target-4*": "this" }}
      {...props}
    >
      {props.children}
    </form>
  );
};

const EmailLabel = () => {
  return <Label for="email-input">email:</Label>;
};

const PasswordLabel = () => {
  return <Label for="password-input">password:</Label>;
};

const ConfirmPasswordLabel = () => {
  return <Label for="confirm-password-input">confirm password:</Label>;
};

const EmailInput = (props: InputProps) => {
  return (
    <Input
      placeholder="micheal@email.com"
      type="text"
      id="email-input"
      name="email"
      variant="form"
      {...props}
    />
  );
};

const PasswordInput = (props: InputProps) => {
  return (
    <Input
      placeholder="******"
      type="password"
      id="password-input"
      name="password"
      variant="form"
      {...props}
    />
  );
};

const ConfirmPasswordInput = (props: InputProps) => {
  return (
    <Input
      placeholder="******"
      type="password"
      id="confirm-password-input"
      name="confirmPassword"
      variant="form"
      {...props}
    />
  );
};

const ErrorMsg = (props: JSX.HtmlTag) => {
  return (
    <p class="mt-1 text-xs text-destructive" {...props}>
      {props.children}
    </p>
  );
};

const SubmitButton = ({ children, ...props }: JSX.HtmlButtonTag) => {
  return (
    <Button class="text-base font-bold" {...props}>
      <Loader class="mr-2" />
      {children}
    </Button>
  );
};

const SigInRedirect = () => {
  return (
    <p class="mt-2 text-center text-sm text-muted-foreground">
      already a member ? <Link href="/sign-in">sign in</Link>
    </p>
  );
};

const SignUpRedirect = () => {
  return (
    <p class="mt-2 text-center text-sm text-muted-foreground">
      don't have an account ? <Link href="/sign-up">sign up</Link>
    </p>
  );
};

const Title = (props: JSX.HtmlTag) => {
  return (
    <h2 class="mt-20 text-center text-3xl font-semibold" {...props}>
      {props.children}
    </h2>
  );
};

const Container = (props: JSX.HtmlTag) => {
  return (
    <main
      class="mx-auto flex max-w-lg flex-col"
      hx-ext="response-targets"
      {...props}
    >
      {props.children}
    </main>
  );
};

export const AuthForm = {
  SignInForm,
  SignUpForm,
  EmailLabel,
  PasswordLabel,
  ConfirmPasswordLabel,
  EmailInput,
  PasswordInput,
  ConfirmPasswordInput,
  ErrorMsg,
  SubmitButton,
  SigInRedirect,
  SignUpRedirect,
  Title,
  Container,
};
