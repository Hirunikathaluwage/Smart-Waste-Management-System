import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineChartBar, HiOutlineTruck, HiOutlineClipboardCheck } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';
import { useState, useEffect } from 'react';

const FEATURES = [
  {
    Icon: HiOutlineLocationMarker,
    title: 'Real-Time Tracking',
    description: 'Track waste collection vehicles in real-time and get accurate arrival estimates with GPS precision.'
  },
  {
    Icon: HiOutlineCalendar,
    title: 'Smart Scheduling',
    description: 'AI-powered collection routes and schedules that adapt to your needs for maximum efficiency.'
  },
  {
    Icon: IoLeafOutline,
    title: 'Eco-Friendly',
    description: 'Reduce carbon footprint by up to 40% with optimized routes and sustainable practices.'
  }
];

const STATS = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Waste Collections' },
  { value: '35%', label: 'CO₂ Reduced' },
  { value: '200+', label: 'Cities Served' }
];

const STEPS = [
  {
    Icon: HiOutlineClipboardCheck,
    title: 'Schedule Collection',
    description: 'Select your preferred time and date for waste pickup through our easy-to-use interface.'
  },
  {
    Icon: HiOutlineTruck,
    title: 'Track in Real-Time',
    description: 'Monitor your collection vehicle\'s location and receive notifications as it approaches.'
  },
  {
    Icon: HiOutlineChartBar,
    title: 'View Impact',
    description: 'See your environmental contribution and track your carbon footprint reduction over time.'
  }
];

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const currentCount = Math.floor(percentage * parseInt(end));
      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{end.includes('+') ? '+' : ''}{end.includes('%') ? '%' : ''}</span>;
};

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="flex-grow overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#3d9613] via-[#2f7410] to-[#1f4d0a] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="inline-block px-4 py-2 bg-[#4CBB17]/20 rounded-full mb-6 backdrop-blur-sm border border-[#70d63a]/30">
                <span className="text-[#b4eb91] text-sm font-semibold">🌱 Sustainable Future</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Smart Waste Management for a
                <span className="text-[#8fe060] block mt-2">Greener Tomorrow</span>
              </h1>

              <p className="text-lg md:text-xl mb-8 text-[#d9f5c8] leading-relaxed">
                Revolutionizing waste collection with intelligent scheduling,
                real-time tracking, and eco-friendly solutions that make a real difference.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-white text-[#2f7410] px-8 py-4 rounded-xl font-semibold hover:bg-[#edfae0] transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform">
                  Get Started
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="bg-[#3d9613]/30 backdrop-blur-sm border-2 border-[#70d63a]/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3d9613]/50 hover:border-[#8fe060] transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className={`hidden md:block transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-[#70d63a]/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="aspect-square bg-gradient-to-br from-[#5ec928] to-[#3d9613] rounded-2xl flex items-center justify-center">
                    <IoLeafOutline className="text-9xl text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, index) => (
              <div
                key={label}
                className={`text-center transform transition-all duration-700 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#3d9613] mb-2">
                  <AnimatedCounter end={value} />
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#edfae0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1f4d0a]">
              Why Choose EcoCollect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of waste management with cutting-edge technology and sustainable practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ Icon, title, description }, index) => (
              <div
                key={title}
                className={`group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#8fe060] hover:-translate-y-2 transform delay-${index * 100}`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CBB17] to-[#3d9613] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1f4d0a]">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1f4d0a]">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and join the sustainable waste management revolution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[#70d63a] via-[#4CBB17] to-[#70d63a] -z-10 mx-24"></div>

            {STEPS.map(({ Icon, title, description }, index) => (
              <div key={title} className="relative">
                <div className="bg-gradient-to-br from-[#edfae0] to-white rounded-2xl p-8 shadow-sm border-2 border-[#d9f5c8] hover:border-[#8fe060] transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#4CBB17] to-[#3d9613] rounded-full flex items-center justify-center mb-4 shadow-lg relative z-10">
                      <Icon className="text-3xl text-white" />
                    </div>
                    <div className="absolute top-8 left-8 w-10 h-10 bg-[#3d9613] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#1f4d0a] mt-2">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3d9613] via-[#2f7410] to-[#3d9613] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-50"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-[#d9f5c8] leading-relaxed">
              Join thousands of users making waste management smarter, more efficient, and environmentally sustainable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-white text-[#2f7410] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#edfae0] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                Start Today
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="bg-[#3d9613]/30 backdrop-blur-sm border-2 border-white/50 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#3d9613]/50 hover:border-white transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;