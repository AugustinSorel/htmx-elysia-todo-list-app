const Item = (props: JSX.HtmlTag) => {
  return (
    <header
      class="sticky top-0 flex items-center justify-between border-b border-current bg-accent px-max-width py-4 text-background"
      {...props}
    >
      {props.children}
    </header>
  );
};

const Title = () => {
  return <h1 class="text-xl font-semibold capitalize">todo list</h1>;
};

const SignOut = () => {
  return (
    <button
      class="hover:underline"
      hx-post="/api/auth/sign-out"
      hx-history="false"
    >
      sign out
    </button>
  );
};

export const Header = {
  Item,
  Title,
  SignOut,
};
