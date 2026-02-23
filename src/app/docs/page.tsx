"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { swaggerSpec } from "@/lib/swagger"; // tvoj swagger.ts fajl

export default function DocsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">API Dokumentacija - Pub Kviz</h1>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}