import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">Payment success!</h1>
        <p className="mt-2 text-gray-600">Thank you for using our service.</p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Back to website
          </button>
        </Link>
      </div>
    </div>
  );
}
