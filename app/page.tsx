import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-300">e-sky</span>
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Your one-stop solution for blockchain analytics and insights.
        </p>
        <button className="bg-yellow-300 text-gray-900 px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-400 transition duration-300">
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-yellow-300">e-sky</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Real-Time Analytics</h3>
            <p>
              Get instant insights into blockchain data with powerful real-time
              metrics.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-2xl font-bold mb-4">
              Comprehensive Dashboards
            </h3>
            <p>
              Explore well-designed dashboards to visualize complex blockchain
              data easily.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Secure & Reliable</h3>
            <p>
              Trust our platform for secure access to blockchain analytics and
              insights.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gray-800 text-center py-12">
        <h2 className="text-3xl font-bold mb-6">
          Ready to explore blockchain like never before?
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold transition duration-300">
          Get Started Now
        </button>
      </div>
    </div>
  );
}
