import React from "react"
import Post from "./Post"
import Login from "./accounts/Login"
import Signup from "./accounts/Signup";
import { Routes , Route } from "react-router-dom";
import AppLayout from "../components/AppLayout";
function Root() {
  return (
    <div>
      <AppLayout>
        {/* 라우팅 컴포넌트 BrowserRouter -> Routes -> Route 순으로 컴포넌트 구성해야 합니다 */}
        <Routes>
          <Route path="/" element={<Post />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          
        </Routes>
      </AppLayout>
    </div>
  );
}

export default Root;
