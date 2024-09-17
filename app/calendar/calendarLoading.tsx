function CalendarLoading() {

  return (
    <div className="w-full h-[80vh] p-3 bg-white grid grid-cols-5 grid-rows-5">
      {Array.from({ length: 25 }, (_, i) => {
        // Skip some of the loading squares to make it look more random
        const shouldSkip = Math.random() < 0.4;
        const animationDelay = `${Math.random() * 2}s`; // Random delay between 0 and 2 seconds
        return shouldSkip ? (
          <div key={i} className="bg-transparent p-4 m-1"></div>
        ) : (
          <div
            key={i}
            className="bg-gray-400 opacity-20 rounded-md p-4 m-1 animate-pulse"
            style={{ animationDelay }}
          ></div>
        );
      })}
    </div>
  );
};

export default CalendarLoading;