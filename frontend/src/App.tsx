import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AboutMe } from "@/pages/AboutMe";
import { ProjectShowcase } from "@/pages/projects/ProjectShowcase";
import { ManualAssistant } from "@/features/manual-assistant/ManualAssistant";
import { VehicleTable } from "@/features/vehicles/VehicleTable";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/projects" replace /> },  // ← landing redirect
      { path: "/about", element: <AboutMe /> },
      {
        path: "/projects",
        children: [
          { index: true, element: <ProjectShowcase /> },
          { path: "rag-qa", element: <ManualAssistant /> },
          { path: "vehicles", element: <VehicleTable /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
