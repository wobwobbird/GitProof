import { Route, Routes } from "react-router-dom";
import CreateProof from "@/pages/CreateProof";
import Home from "@/pages/Home";
import ManageProof from "@/pages/ManageProof";
import NotFound from "@/pages/NotFound";
import PublicProof from "@/pages/PublicProof";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/create" element={<CreateProof />} />
      <Route path="/admin/proof/:id" element={<ManageProof />} />
      <Route path="/proof/:id" element={<PublicProof />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
