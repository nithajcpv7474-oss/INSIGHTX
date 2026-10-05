import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sigma,
  BarChart3,
  GitCompare,
  TrendingUp,
  Upload,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  Sparkles,
  Calculator,
  Compass
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070b14',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '25%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Mathematical Equation Watermark Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          fontFamily: 'var(--font-mono)',
          fontSize: '1.2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4rem',
          padding: '4rem',
          userSelect: 'none',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div>{'$$\\bar{x} = \\frac{\\sum x_i}{n}$$'}</div>
        <div>{'$$r = \\frac{\\sum(x-\\bar{x})(y-\\bar{y})}{\\sqrt{\\sum(x-\\bar{x})^2\\sum(y-\\bar{y})^2}}$$'}</div>
        <div>{'$$\\hat{y} = \\beta_0 + \\beta_1 x$$'}</div>
        <div>{'$$\\sigma^2 = \\frac{\\sum(x-\\mu)^2}{N}$$'}</div>
        <div>{'$$s = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n-1}}$$'}</div>
        <div>{'$$R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}$$'}</div>
        <div>{'$$\\rho = 1 - \\frac{6\\sum d_i^2}{n(n^2 - 1)}$$'}</div>
        <div>{'$$Cov(X,Y) = E[(X-\\mu_X)(Y-\\mu_Y)]$$'}</div>
      </div>

      {/* Top Navbar */}
      <header
        style={{
          maxWidth: '1300px',
          width: '100%',
          margin: '0 auto',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
            }}
          >
            <Sigma size={24} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              INSIGHT<span style={{ color: '#06b6d4' }}>X</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
              MATHEMATICAL DATA PLATFORM
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/formula-lab"
            style={{
              fontSize: '0.9rem',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 500,
            }}
          >
            <Calculator size={16} color="#c084fc" />
            <span>Formula Lab</span>
          </Link>
          <Link
            to="/dashboard"
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
          >
            <span>Launch Platform</span>
            <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '4rem 2rem 5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
            }}
          >
            <Sparkles size={16} color="#c084fc" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#e9d5ff' }}>
              Universal Mathematical Data Analytics Architecture
            </span>
          </div>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: '1.5rem',
            color: '#ffffff',
          }}
        >
          Universal Mathematical <br />
          <span className="gradient-text">Data Analytics</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: '#94a3b8',
            maxWidth: '750px',
            margin: '0 auto 2.75rem auto',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Upload data. Discover relationships. Understand the mathematics.
          Engineered explicitly for rigorous university statistical analysis.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <Link
            to="/dataset"
            className="btn-primary"
            style={{ padding: '0.9rem 1.85rem', fontSize: '1.05rem' }}
          >
            <Upload size={20} />
            <span>Upload Dataset</span>
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary"
            style={{ padding: '0.9rem 1.85rem', fontSize: '1.05rem' }}
          >
            <Compass size={20} color="#06b6d4" />
            <span>Explore Sample Data</span>
          </Link>
        </div>

        {/* Syllabus Scope Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
            textAlign: 'left',
          }}
        >
          {/* Card 1: Statistics */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderTop: '3px solid #a855f7',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                }}
              >
                <BarChart3 size={24} />
              </div>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Introduction to Statistics
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6, flex: 1 }}>
              Rigorous measures of central tendency and dispersion. Detailed computation of arithmetic mean, median, mode, sample variance, standard deviation, and interquartile ranges.
            </p>

            <Link
              to="/statistics"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#c084fc',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginTop: 'auto',
              }}
            >
              <span>Explore Statistics View</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Card 2: Correlation */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderTop: '3px solid #06b6d4',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22d3ee',
                }}
              >
                <GitCompare size={24} />
              </div>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Correlation Analysis
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6, flex: 1 }}>
              Bivariate association exploration via Pearson product-moment coefficient, Spearman rank order, and sample covariance matrices paired with interactive scatter geometry.
            </p>

            <Link
              to="/correlation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#22d3ee',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginTop: 'auto',
              }}
            >
              <span>Explore Correlation View</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Card 3: Regression */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              borderTop: '3px solid #ec4899',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f472b6',
                }}
              >
                <TrendingUp size={24} />
              </div>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Regression Modeling
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6, flex: 1 }}>
              Ordinary Least Squares (OLS) mathematical fitting. Computation of slope coefficients, intercept, coefficient of determination (R²), and conditional value estimation.
            </p>

            <Link
              to="/regression"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#f472b6',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginTop: 'auto',
              }}
            >
              <span>Explore Regression View</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mathematical Architecture Guarantee */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(10, 14, 26, 0.8)',
          padding: '2.5rem 2rem',
          marginTop: 'auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
              INSIGHTX — Data Analytics Platform
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Structured Mathematical Data Analytics Platform
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            <Link to="/dashboard" style={{ transition: 'color 0.2s' }}>Dashboard</Link>
            <Link to="/dataset" style={{ transition: 'color 0.2s' }}>Dataset Hub</Link>
            <Link to="/formula-lab" style={{ transition: 'color 0.2s' }}>Formula Lab</Link>
            <Link to="/report" style={{ transition: 'color 0.2s' }}>Report Preview</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
