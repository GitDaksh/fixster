"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignUpButton, SignInButton } from "@clerk/nextjs";
import { getUserProjects, Project } from "./services/projectService";
import { Code, Zap, Shield, Brain, Star, ArrowRight, Terminal, GitBranch, Cpu, Github } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userProjects = getUserProjects(user.id);
      setProjects(userProjects);
    }
    setLoading(false);
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-slate-400">Loading your workspace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            
            <div className="relative">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-8 animate-float">
                <span className="animate-pulse">✨</span>
                <span className="ml-2">AI-Powered Code Debugging</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                Debug Your Code with
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 text-transparent bg-clip-text"> AI Magic</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of coding with Fixster. Our AI-powered platform helps you write better code, 
                catch bugs instantly, and boost your productivity by up to 10x.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  <SignInButton mode="modal">
                    <button
                      className="group w-full bg-slate-800/50 hover:bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Code className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Start Debugging</h3>
                      <p className="text-sm text-slate-400">Debug your code with AI assistance and get instant solutions</p>
                      <div className="flex items-center mt-4 text-blue-400">
                        <span className="text-sm">Try it now</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </SignInButton>

                  <SignInButton mode="modal">
                    <button
                      className="group w-full bg-slate-800/50 hover:bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                        <Terminal className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Live Editor</h3>
                      <p className="text-sm text-slate-400">Write and test code with real-time AI suggestions</p>
                      <div className="flex items-center mt-4 text-purple-400">
                        <span className="text-sm">Open editor</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </button>
                  </SignInButton>
                </div>

                <a
                  href="https://github.com/GitDaksh/fixster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-8 py-4 bg-slate-800/50 rounded-xl text-white font-semibold text-lg hover:bg-slate-800 transition-all duration-300"
                >
                  <Github className="w-5 h-5 mr-2" />
                  <span>Star on GitHub</span>
                </a>
              </div>

              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-16">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-2">10K+</div>
                  <div className="text-slate-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text mb-2">1M+</div>
                  <div className="text-slate-400">Lines Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 text-transparent bg-clip-text mb-2">98%</div>
                  <div className="text-slate-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text mb-2">24/7</div>
                  <div className="text-slate-400">AI Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Fixster?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Code Analysis</h3>
              <p className="text-slate-400">Advanced AI algorithms analyze your code in real-time, providing intelligent suggestions and improvements.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-400">Get instant feedback and suggestions as you code, without any delay or interruption to your workflow.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-400">Your code is encrypted and never stored. We prioritize your privacy and data security.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multi-Language Support</h3>
              <p className="text-slate-400">Works with JavaScript, TypeScript, Python, Java, and C++. More languages coming soon!</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Project Management</h3>
              <p className="text-slate-400">Organize your code into projects, track changes, and collaborate with your team seamlessly.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance Optimization</h3>
              <p className="text-slate-400">Get detailed insights into your code's performance and suggestions for optimization.</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">JD</div>
                <div className="ml-4">
                  <div className="text-white font-semibold">John Doe</div>
                  <div className="text-slate-400 text-sm">Senior Developer</div>
                </div>
              </div>
              <p className="text-slate-300">&quot;Fixster has revolutionized how I debug code. The AI suggestions are incredibly accurate and have saved me countless hours.&quot;</p>
              <div className="flex mt-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">AS</div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Alice Smith</div>
                  <div className="text-slate-400 text-sm">Full Stack Developer</div>
                </div>
              </div>
              <p className="text-slate-300">&quot;The real-time code analysis is a game-changer. It catches issues before they become problems and suggests improvements I hadn&apos;t considered.&quot;</p>
              <div className="flex mt-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-semibold">MJ</div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Mike Johnson</div>
                  <div className="text-slate-400 text-sm">Tech Lead</div>
                </div>
              </div>
              <p className="text-slate-300">&quot;As a tech lead, I love how Fixster helps my team write better code. It&apos;s like having an expert code reviewer available 24/7.&quot;</p>
              <div className="flex mt-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Coding Experience?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already using Fixster to write better code, faster.
            </p>
            <SignUpButton mode="modal">
              <button
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </SignUpButton>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Fixster</h3>
                <p className="text-slate-400 text-sm">
                  AI-powered code debugging and development assistant
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Features</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Pricing</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">About</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Blog</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Privacy</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Terms</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white text-sm">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
              © 2024 Fixster. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Fixster
          </h1>
          <p className="text-lg text-slate-400">
            AI-powered code debugging assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/new-project")}
            className="group relative bg-slate-800 rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer"
          >
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Create New Project</h2>
              <p className="text-slate-400">Start fresh with a new project and get AI assistance</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>

          <button
            onClick={() => router.push("/projects")}
            className="group relative bg-slate-800 rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 cursor-pointer"
          >
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Existing Projects</h2>
              <p className="text-slate-400">
                {projects.length > 0 
                  ? `Continue working on one of your ${projects.length} existing projects`
                  : "Browse and select from your existing projects"}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </div>

        {projects.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
            <div className="grid gap-4">
              {projects.slice(0, 3).map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    localStorage.setItem("activeProject", project.id);
                    router.push("/dashboard");
                  }}
                  className="flex items-center p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-white">{project.name}</h4>
                    <p className="text-sm text-slate-400">{project.description}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}