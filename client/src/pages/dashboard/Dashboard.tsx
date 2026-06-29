import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/theme-provider';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">My-Quizz</h1>
          <div className="flex items-center gap-4">
            <span className="text-white/90 hidden sm:inline-block">Xin chào, {user?.displayName || user?.email}</span>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all flex items-center justify-center"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium backdrop-blur-md transition-all"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-colors duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mb-4">Tổng quan Bảng điều khiển</h2>
          <p className="text-gray-600 dark:text-slate-400">
            Chào mừng bạn đến với trang quản trị. Từ đây, bạn có thể quản lý các bộ câu hỏi, theo dõi phòng chơi trực tiếp và xem kết quả.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 transition-colors duration-300">
              <h3 className="font-semibold text-red-700 dark:text-red-400 text-lg mb-2">Bộ Câu Hỏi</h3>
              <p className="text-red-600/80 dark:text-red-400/80 text-sm">Tạo và quản lý các bài trắc nghiệm của bạn.</p>
            </div>
            <div className="p-6 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 transition-colors duration-300">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400 text-lg mb-2">Phòng Chơi Trực Tiếp</h3>
              <p className="text-orange-600/80 dark:text-orange-400/80 text-sm">Tổ chức các phiên hỏi đáp theo thời gian thực.</p>
            </div>
            <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 transition-colors duration-300">
              <h3 className="font-semibold text-rose-700 dark:text-rose-400 text-lg mb-2">Báo Cáo</h3>
              <p className="text-rose-600/80 dark:text-rose-400/80 text-sm">Xem lịch sử và đánh giá hiệu suất người chơi.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

