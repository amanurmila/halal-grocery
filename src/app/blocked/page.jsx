export default function BlockedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="p-10 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-700 mb-2">
          Your account has been blocked by an administrator.
        </p>
        <p className="text-gray-600">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
