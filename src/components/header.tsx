import { User } from "lucia";

export const Header = ({ user }: { user?: User }) => {
  return (
    <header class="sticky top-0 flex items-center justify-between border-b border-current bg-accent px-max-width py-4 text-background">
      <h1 class="text-xl font-semibold capitalize">todo list</h1>

      {user && (
        <button class="hover:underline" hx-post="/sign-out" hx-history="false">
          sign out
        </button>
      )}
    </header>
  );
};
