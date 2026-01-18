import Layout from "../components/layout/Layout";
import LoginForm from "../components/authentication/LoginForm";

const LoginPage = () => {
    return (
        <>
            <Layout>
                <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
                    <LoginForm />
                </div>
            </Layout>
        </>
    )
}

export default LoginPage;