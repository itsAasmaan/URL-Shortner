import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const HomePage = () => (
  <Layout>
    <div className="card animate-fade-in m-10">
      <h1 className="text-primary-600 text-3xl font-bold">Welcome to URL Shortener</h1>
      <p className="text-gray-600 mt-2">This is the Home Page.</p>
      <Link title="Go to Dashboard" to="/dashboard" className="btn-primary mt-4 inline-block">
        Go to Dashboard
      </Link>
    </div>
  </Layout>
);

export default HomePage;
