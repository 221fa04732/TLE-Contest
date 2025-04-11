export default function Footer() {
    return (
      <footer className="w-full bg-gradient-to-br from-black/70 via-gray-900/50 to-blue-950/60 backdrop-blur-xl text-gray-300 py-10 border-t border-blue-800 shadow-lg shadow-blue-900/30">
        <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
  
          {/* Brand Info */}
          <div>
            <div className="font-bold text-xl mb-2 text-cyan-400 drop-shadow-[0_0_5px_#00ffff]">TLE Contest</div>
            <p className="text-gray-400">
              Empowering competitive programmers with advanced tools and resources.
            </p>
            <p className="mt-2 text-blue-400 font-medium drop-shadow-[0_0_4px_#60a5fa]">500+ Contests Tracked</p>
          </div>
  
          {/* Quick Links */}
          <div>
            <div className="font-semibold text-lg mb-2 text-cyan-300 drop-shadow-[0_0_5px_#22d3ee]">Quick Links</div>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white transition-all duration-150">Contests</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-150">Leaderboard</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-150">Practice</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-150">Analytics</a></li>
            </ul>
          </div>
  
          {/* Connect Section */}
          <div>
            <div className="font-semibold text-lg mb-2 text-cyan-300 drop-shadow-[0_0_5px_#22d3ee]">Connect With Us</div>
            <p className="text-gray-400">
              Join our community of <span className="font-semibold text-white drop-shadow-[0_0_4px_#fff]">5,000+</span> programmers
            </p>
          </div>
  
        </div>
  
        {/* Bottom copyright */}
        <div className="border-t border-blue-800 mt-10 pt-4 text-center text-xs text-gray-500">
          © 2025 <span className="text-cyan-400">TLE Contest</span>. All rights reserved.
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-white">Terms</a>
          <span className="mx-1">•</span>
          <a href="#" className="hover:text-white">Privacy</a>
          <span className="mx-1">•</span>
          <a href="#" className="hover:text-white">Contact</a>
          <br className="md:hidden" />
          <span className="block md:inline mt-2 text-blue-300 drop-shadow-[0_0_3px_#60a5fa]">Made with ❤ for competitive programmers</span>
        </div>
      </footer>
    );
  }