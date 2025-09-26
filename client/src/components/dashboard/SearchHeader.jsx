export default function SearchHeader() {
  return (
    <div className="bg-white dark:bg-gray-800/60 h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 rounded-xl">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative w-80 max-w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input className="w-full h-11 pl-10 pr-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600" placeholder="Search skills, colleagues..." type="text" />
        </div>
        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <span className="material-symbols-outlined text-3xl">notifications</span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </button>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQYaZ44qmpbSFqN_evxgW4SzRF91LGgjNXvYeamQj2nquMEzACjEgTHFP8-1962hb5WZVwg3qXwxaMjGDA5rkRXX1_NEjdCA9nFvUk3TNDIe_GzLvNviDPMnRRvyBMP7MV28vIM9zPmDO-pkTne1gnwzb571iXTh7WBZIp7amqdMSxdfMH37UBB6HN_YrfTHQR64DKYbvHrFYkw9RFLNKsDRR3E-Ec1aXeAM5U7OdkTMErtgYSrQOijzbPGTtPrOGTP9oNTwYoEb8')" }} />
      </div>
    </div>
  )
}


