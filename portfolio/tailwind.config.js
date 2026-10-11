tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',
          500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95'
        },
        secondary: {
          50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',
          500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e'
        },
        dark: {
          50:'#64748b',100:'#475569',200:'#334155',300:'#1e293b',400:'#0f172a',
          500:'#020617',600:'#000712',700:'#00040d',800:'#000208',900:'#000000'
        }
      },
      animation: {
        'float':'float 6s ease-in-out infinite',
        'float-2':'float 8s ease-in-out infinite',
        'float-3':'float 10s ease-in-out infinite',
        'pulse-glow':'pulse-glow 2s ease-in-out infinite',
        'gradient':'gradient 8s ease infinite',
        'bounce-slow':'bounce 3s infinite',
        'spin-slow':'spin 20s linear infinite',
        'ping-slow':'ping 3s cubic-bezier(0,0,.2,1) infinite',
        'fade-in-up':'fadeInUp .8s ease-out',
        'text-shimmer':'textShimmer 3s linear infinite',
        'border-glow':'borderGlow 2s ease-in-out infinite',
        'neon-flicker':'neonFlicker 1.5s ease-in-out infinite',
        'morph':'morph 12s ease-in-out infinite'
      },
      keyframes: {
        float: {'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-20px)'}},
        'pulse-glow': {
          '0%,100%':{opacity:'1',boxShadow:'0 0 20px rgba(139,92,246,.5)'},
          '50%':{opacity:'.8',boxShadow:'0 0 40px rgba(139,92,246,.8)'}
        },
        gradient: {'0%,100%':{backgroundPosition:'0% 50%'},'50%':{backgroundPosition:'100% 50%'}},
        fadeInUp: {'0%':{transform:'translateY(30px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'}},
        textShimmer: {'0%':{backgroundPosition:'-200% center'},'100%':{backgroundPosition:'200% center'}},
        borderGlow: {
          '0%,100%':{borderColor:'rgba(139,92,246,.5)'},
          '50%':{borderColor:'rgba(6,182,212,.85)'}
        },
        neonFlicker: {
          '0%,100%':{opacity:'1',filter:'drop-shadow(0 0 5px #8b5cf6)'},
          '50%':{opacity:'.85',filter:'drop-shadow(0 0 18px #06b6d4)'}
        },
        morph: {
          '0%,100%':{borderRadius:'60% 40% 30% 70%/60% 30% 70% 40%'},
          '50%':{borderRadius:'30% 60% 70% 40%/50% 60% 30% 60%'}
        }
      },
      backgroundImage: {
        'gradient-radial':'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':'linear-gradient(90deg,#8b5cf6 0%,#3b82f6 50%,#06b6d4 100%)'
      }
    }
  }
};