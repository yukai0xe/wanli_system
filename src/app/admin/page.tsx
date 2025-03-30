
const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Admin Login</h1>
        <form className="mt-4 flex flex-col">
            <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded mb-2"
            />
            <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded mb-4"
            />
            <button className="bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
        </div>
    );
}

export default LoginPage;