import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginPrompt } from "./LoginPrompt";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  useEffect(() => {
    if (user) setLoginPromptOpen(false);
  }, [user]);

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setLoginPromptOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 group">
            <img
              src="faviconnew2.svg"
              alt="logo"
              className="h-10 w-10 transition-transform duration-300 group-hover:rotate-12"
            />
            <Link
              to="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent"
            >
              ClipNote
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            <a
              href="/"
              className="relative text-muted-foreground hover:text-primary transition-colors after:block after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>
            <a
              href="/#features"
              className="relative text-muted-foreground hover:text-primary transition-colors after:block after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Service
            </a>
            <a
              href="#pricing"
              className="relative text-muted-foreground hover:text-primary transition-colors after:block after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Pricing
            </a>
            <Link to="/summary" onClick={handleProtectedClick} className="relative text-muted-foreground hover:text-primary transition-colors after:block after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Summaries
            </Link>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full hover:bg-accent transition"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium">{user.name || user.email}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="hover:shadow-md flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="hover:shadow-md">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary  to-green-600 text-white hover:shadow-lg hover:scale-105 transition-all rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background/90 backdrop-blur-md border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4 px-6 py-6">
              <a href="/" className="text-muted-foreground hover:text-primary">
                Home
              </a>
              <a href="#features" className="text-muted-foreground hover:text-primary">
                Service
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary">
                Pricing
              </a>

              {/* Auth in Mobile */}
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <span className="font-medium text-center">
                      {user.name || user.email}
                    </span>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-gradient-to-r from-primary to-green-500 text-white rounded-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}

                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full flex justify-center items-center"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 mr-2" />
                  ) : (
                    <Moon className="h-5 w-5 mr-2" />
                  )}
                  Toggle Theme
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginPrompt open={loginPromptOpen} onOpenChange={setLoginPromptOpen} />
    </>
  );
};
