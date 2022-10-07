import React from "react";
import { Helmet } from "react-helmet-async";

interface HelmetType {
  title: string;
  description: string;
}

const NewHelmet = ({ title, description }: HelmetType) => {
  return (
    <Helmet>
      <title>README 🖌️ {title}</title>
      <meta name="description" content={description} data-react-helmet="true" />
    </Helmet>
  );
};

export default NewHelmet;
