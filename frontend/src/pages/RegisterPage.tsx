import Layout from "../components/layout/Layout";
import RegistrationForm from "../components/authentication/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
          <RegistrationForm />
        </div>
      </Layout>
    </>
  );
};

export default RegisterPage;
