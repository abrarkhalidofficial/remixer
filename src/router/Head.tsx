import { Helmet } from "react-helmet";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function Head({ title, description, children }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description ? description : title} />
      {children}
    </Helmet>
  );
}
