const Item = (props: JSX.HtmlTag) => {
  return <head {...props}>{props.children}</head>;
};
const Title = (props: JSX.HtmlTag) => {
  return <title {...props}>{props.children}</title>;
};

const Style = () => {
  return <link rel="stylesheet" href="/public/styles.css" />;
};

const Htmx = () => {
  return (
    <script
      src="https://unpkg.com/htmx.org@1.9.12"
      integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
      crossorigin="anonymous"
    ></script>
  );
};

const HtmxResponseTarget = () => {
  return (
    <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
  );
};

export const Head = {
  Item,
  Title,
  Style,
  Htmx,
  HtmxResponseTarget,
};
