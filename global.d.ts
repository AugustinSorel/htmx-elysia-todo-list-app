import { Alpine as AlpineType } from "alpinejs";

declare global {
  const Alpine: AlpineType;
  const $el: HTMLElement;
}
