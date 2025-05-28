import React from "react";

const MarketToolsSection = () => {
  return (
    <section className="flex flex-col items-center text-center py-12 bg-white">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        Find the top in market EAs, Indicators, Dashboards and more
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Whether you're a seasoned trader looking for fresh insights or a beginner eager to learn, this hub is tailored for you
      </p>
      <div className="flex flex-wrap justify-center items-center gap-12">
        <div className="w-full max-w-md">
        <img 
            src="./Home/img/p3.png" 
            alt="Team meeting" 
            className="w-full rounded-lg" 
        />

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Expert Advisers (EAs)", count: "2,736" },
            { title: "Indicators", count: "13,932" },
            { title: "Tools", count: "52,822" },
            { title: "Dashboards", count: "6,196" },
            { title: "Scripts", count: "22,649" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {item.title}
              </h3>
              <p className="text-md text-gray-600">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketToolsSection;
