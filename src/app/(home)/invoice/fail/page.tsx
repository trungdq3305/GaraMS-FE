import Link from "next/link";

export default function FailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment fail</h1>
        <p className="mt-2 text-gray-600">An error occurs, Please try again later.</p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Back to website
          </button>
        </Link>
      </div>
    </div>
  );
}
