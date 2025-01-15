"use client";

import React, { Suspense } from "react";
import PageContents from "./PageContent";

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContents />
    </Suspense>
  );
};

export default SearchPage;
