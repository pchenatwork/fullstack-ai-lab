import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Contact } from "@/pages/Contact";
import { ProjectShowcase } from "@/pages/projects/ProjectShowcase";
import { ManualAssistant } from "@/features/manual-assistant/ManualAssistant";
import { VehicleTable } from "@/features/vehicles/VehicleTable";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/contact", element: <Contact /> },
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
