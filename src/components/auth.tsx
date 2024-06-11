import { Button } from "./ui/button";
import { Loader } from "./ui/loader";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "./ui/link";
import { SignInSchema, SignUpSchema } from "../schemas/auth.schemas";

type SignUpFormProps = Partial<{
  values: Partial<SignUpSchema>;
  errors: Partial<SignUpSchema>;
}>;

export const SignUpForm = ({ values, errors }: SignUpFormProps) => {
  return (
    <form
      class="group flex flex-col [&>button]:mt-10 [&>label]:mb-1 [&>label]:mt-4"
      hx-post="/sign-up"
      hx-disabled-elt="button"
      hx-swap="outerHTML"
      {...{ "hx-target-4*": "this" }}
    >
      <EmailLabel />
      <EmailInput value={values?.email} />
      {errors?.email && <ErrorMsg>{errors.email}</ErrorMsg>}

      <PasswordLabel />
      <PasswordInput value={values?.password} />
      {errors?.password && <ErrorMsg>{errors.password}</ErrorMsg>}

      <ConfirmPasswordLabel />
      <ConfirmPasswordInput value={values?.confirmPassword} />
      {errors?.confirmPassword && <ErrorMsg>{errors.confirmPassword}</ErrorMsg>}

      <SubmitButton>sign up</SubmitButton>
      <RedirectMsg>
        already a member ? <Link href="/sign-in">sign in</Link>{" "}
      </RedirectMsg>
    </form>
  );
};

type SignInFormProps = Partial<{
  values: Partial<SignInSchema>;
  errors: Partial<SignInSchema>;
}>;

export const SignInForm = ({ values, errors }: SignInFormProps) => {
  return (
    <form
      class="group flex flex-col [&>button]:mt-10 [&>label]:mb-1 [&>label]:mt-4"
      hx-post="/sign-in"
      hx-disabled-elt="button"
      hx-swap="outerHTML"
      {...{ "hx-target-4*": "this" }}
    >
      <EmailLabel />
      <EmailInput value={values?.email} />
      {errors?.email && <ErrorMsg>{errors.email}</ErrorMsg>}

      <PasswordLabel />
      <PasswordInput value={values?.password} />
      {errors?.password && <ErrorMsg>{errors.password}</ErrorMsg>}

      <SubmitButton>sign up</SubmitButton>

      <RedirectMsg>
        don't have an account ? <Link href="/sign-up">sign up</Link>
      </RedirectMsg>
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

const RedirectMsg = (props: JSX.HtmlTag) => {
  return (
    <p class="mt-2 text-center text-sm text-muted-foreground" {...props}>
      {props.children}
    </p>
  );
};
