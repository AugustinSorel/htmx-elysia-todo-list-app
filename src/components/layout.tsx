const Body = (props: JSX.HtmlBodyTag) => {
  return <body {...props}>{props.children}</body>;
};

const H = (props: JSX.HtmlHtmlTag) => {
  return (
    <html lang="en" {...props}>
      {props.children}
    </html>
  );
};

export const Layout = {
  Html: H,
  Body,
};
