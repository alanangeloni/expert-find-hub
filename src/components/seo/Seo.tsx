import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const Seo: React.FC<SeoProps> = ({ title, description, children }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </Helmet>
  );
};

export default Seo;
