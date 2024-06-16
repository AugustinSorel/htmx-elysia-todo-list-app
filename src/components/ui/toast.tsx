import { Icon } from "./icon";

export const Toasts = () => {
  return (
    <ol
      dir="lte"
      tabindex="-1"
      class="fixed bottom-5 right-5 isolate z-50 block w-full sm:w-80"
      x-on:mouseenter="toastsInCol()"
      x-on:mouseleave="stackToasts()"
      x-init={toastsInit.toString()}
      x-data={toastsData.toString()}
      {...{
        "x-on:alpine-show-toast.window": `
                toasts.unshift({
                    id: 'toast-' + Math.random().toString(16).slice(2),
                    title: event.detail.title,
                    description: event.detail.description,
                    type: event.detail.type,
                });
          `,
      }}
    >
      <template x-for="(toast, index) in toasts" x-bind:key="toast.id">
        <li
          class="group fixed bottom-5 right-5 grid w-80 grid-cols-[auto_1fr_auto] items-center gap-x-1 overflow-hidden border border-muted bg-background p-4 shadow-md transition-all animate-in fade-in slide-in-from-bottom after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-black/10 after:animate-in after:slide-in-from-left after:[animation-duration:6s]"
          x-bind:style="{height: `${toastSize}rem`}"
          x-on:animationend="if(event.pseudoElement === '::after') burnToast($el); if(event.target.classList.contains('animate-out')) deleteToastWithId(toast.id)"
          x-bind:id="toast.id"
          x-init="stackToasts()"
          role="status"
        >
          <Icon
            icon="error"
            class="fill-red-500 text-white"
            x-show="toast.type === 'error'"
          />
          <strong
            class="truncate text-sm"
            x-show="toast.title"
            x-text="toast.title"
          ></strong>
          <button
            aria-label="close"
            class="rounded-full p-1 opacity-0 transition-opacity hover:bg-white/10 focus:opacity-100 group-hover:opacity-100"
            x-on:click="burnToast($el.parentNode)"
          >
            <Icon icon="x" size="xs" />
          </button>
          <p
            class="col-span-full col-start-2 truncate text-xs text-muted-foreground"
            x-text="toast.description"
            x-show="toast.description"
          ></p>
        </li>
      </template>
    </ol>
  );
};

const toastsData = () => ({
  toasts: [] as Array<{ id: string }>,
  gap: 0.5,
  toastSize: 5,
  marginBottom: 1,

  toastsInCol: function () {
    const n = Math.min(this.toasts.length, 3);

    $el.style.height = `${n * this.toastSize + this.gap * n}rem`;

    for (let i = 0; i < n; i++) {
      const toast = this.getToastEl(this.toasts[i].id);

      toast.style.bottom = `${this.toastSize * i + this.gap * i + this.marginBottom}rem`;
      toast.style.transform = "scale(1)";
    }
  },

  deleteToastWithId: function (id: string) {
    this.toasts = this.toasts.filter((todo) => todo.id !== id);
    this.stackToasts();
  },

  burnToast: function ($el: HTMLElement) {
    setTimeout(() => {
      $el.classList.replace("animate-in", "animate-out");
      $el.classList.replace("fade-in", "fade-out");
    }, 10);
  },

  stackToasts: function () {
    if (this.toasts.length > 0) {
      $el.style.height = `${this.toastSize}rem`;
    }

    for (let i = 0; i < this.toasts.length; i++) {
      const toast = this.getToastEl(this.toasts[i].id);

      if (i > 2) {
        toast.style.display = "none";
      } else {
        toast.style.transform = `translateY(${i * -this.gap}rem) scale(${1 - i / 30})`;
        toast.style.zIndex = `${i * -1}`;
        toast.style.bottom = `${this.marginBottom}rem`;
      }
    }
  },

  getToastEl: function (id: string) {
    const toast = document.getElementById(id);

    if (!toast) {
      throw new Error(`Toast with id ${id} not found in the dom`);
    }

    return toast;
  },
});

const toastsInit = () => {
  document.body.addEventListener("htmx-show-toast", (e: any) => {
    const detail: Toast = {
      description: e.detail.description,
      title: e.detail.title,
      type: e.detail.type,
    };

    window.dispatchEvent(new CustomEvent("alpine-show-toast", { detail }));
  });
};

type Toast = {
  title: string;
  description: string;
  type: "error";
};

export const createHtmxToast = (toast: Toast) => {
  return JSON.stringify({ "htmx-show-toast": toast });
};
